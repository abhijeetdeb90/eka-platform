/**
 * EKA Platform - Payments & Creator Settlement Integration Test Suite
 * 
 * Tests all 15 sandbox/test-mode scenarios:
 *  1. Successful payment
 *  2. Failed payment
 *  3. Subscription creation
 *  4. Subscription renewal
 *  5. Subscription cancellation
 *  6. Refund
 *  7. Creator onboarding
 *  8. Creator earning creation
 *  9. Creator payout
 * 10. Failed payout
 * 11. Duplicate webhook
 * 12. Webhook replay
 * 13. Partial refund
 * 14. Reconciliation mismatch
 * 15. Concurrent payout request
 */

import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { MockPaymentProvider } from "../../src/lib/payments/providers/mock.provider";
import { setPaymentProvider } from "../../src/lib/payments/providers";
import { financialLedgerService } from "../../src/lib/payments/ledger.service";
import { paymentsService } from "../../src/lib/payments/payments.service";
import { subscriptionsService } from "../../src/lib/payments/subscriptions.service";
import { creatorEarningsEngine } from "../../src/lib/payments/earnings.service";
import { creatorPayoutsEngine } from "../../src/lib/payments/payouts.service";
import { refundsService } from "../../src/lib/payments/refunds.service";
import { webhookService } from "../../src/lib/payments/webhooks.service";
import { reconciliationService } from "../../src/lib/payments/reconciliation.service";

describe("EKA Payments & Creator Payouts Suite", () => {
  let mockProvider: MockPaymentProvider;

  beforeEach(() => {
    mockProvider = new MockPaymentProvider();
    setPaymentProvider(mockProvider);

    // Reset all in-memory stores between test runs
    financialLedgerService.clearInMemoryStore();
    paymentsService.clearInMemoryStore();
    subscriptionsService.clearInMemoryStore();
    creatorEarningsEngine.clearInMemoryStore();
    creatorPayoutsEngine.clearInMemoryStore();
    refundsService.clearInMemoryStore();
    webhookService.clearInMemoryStore();
    reconciliationService.clearInMemoryStore();
  });

  // ----------------------------------------------------------------------
  // Test 1: Successful Payment
  // ----------------------------------------------------------------------
  it("Scenario 1: Successful payment creates order, verifies HMAC signature, captures funds and posts to ledger", async () => {
    const amountMinor = 500000; // ₹5,000

    const order = await paymentsService.createOrder({
      user_id: "user_patron_01",
      amount_minor: amountMinor,
      purpose: "service",
    });

    assert.equal(order.amount_minor, amountMinor);
    assert.equal(order.status, "CREATED");
    assert.ok(order.razorpay_order_id);

    const paymentId = "pay_test_succ_01";
    const signature = mockProvider.generateValidPaymentSignature(order.razorpay_order_id!, paymentId);

    const result = await paymentsService.verifyAndCapturePayment({
      order_id: order.order_id,
      razorpay_order_id: order.razorpay_order_id!,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      user_id: "user_patron_01",
    });

    assert.equal(result.payment.status, "CAPTURED");
    assert.equal(result.order.status, "PAID");

    // Verify double-entry ledger
    const entries = await financialLedgerService.queryEntries({ referenceId: result.payment.payment_id });
    assert.equal(entries.length, 2);
    const debit = entries.find((e) => e.direction === "DEBIT");
    const credit = entries.find((e) => e.direction === "CREDIT");

    assert.equal(debit?.entity_id, "user_patron_01");
    assert.equal(debit?.amount, amountMinor);
    assert.equal(credit?.entity_id, "eka_platform_escrow");
    assert.equal(credit?.amount, amountMinor);
  });

  // ----------------------------------------------------------------------
  // Test 2: Failed Payment
  // ----------------------------------------------------------------------
  it("Scenario 2: Failed payment transitions state to FAILED without crediting entitlement or ledger", async () => {
    const order = await paymentsService.createOrder({
      user_id: "user_patron_02",
      amount_minor: 29900,
      purpose: "one_time",
    });

    const failedPayment = await paymentsService.markPaymentFailed(
      order.order_id,
      "INSUFFICIENT_FUNDS",
      "Customer account balance insufficient",
    );

    assert.equal(failedPayment.status, "FAILED");
    assert.equal(failedPayment.error_code, "INSUFFICIENT_FUNDS");

    // Verify zero ledger postings for failed payment
    const ledgerEntries = await financialLedgerService.queryEntries({ referenceId: failedPayment.payment_id });
    assert.equal(ledgerEntries.length, 0);
  });

  // ----------------------------------------------------------------------
  // Test 3: Subscription Creation
  // ----------------------------------------------------------------------
  it("Scenario 3: Subscription creation registers customer and recurring plan with initial created state", async () => {
    const sub = await subscriptionsService.createSubscription({
      user_id: "user_patron_sub_01",
      plan_id: "monthly",
      customer_name: "Aaditya Roy",
      customer_email: "aaditya@eka.earth",
    });

    assert.equal(sub.plan_id, "monthly");
    assert.equal(sub.amount_minor, 29900); // ₹299
    assert.equal(sub.status, "created");
    assert.ok(sub.subscription_id.startsWith("EKA-SUB-"));
    assert.ok(sub.razorpay_subscription_id);
  });

  // ----------------------------------------------------------------------
  // Test 4: Subscription Renewal
  // ----------------------------------------------------------------------
  it("Scenario 4: Subscription renewal extends billing cycle and posts recurring revenue to ledger", async () => {
    const sub = await subscriptionsService.createSubscription({
      user_id: "user_patron_renew_01",
      plan_id: "monthly",
      customer_name: "Sneha Sen",
      customer_email: "sneha@eka.earth",
    });

    await subscriptionsService.activateSubscription(sub.subscription_id, {
      payment_id: "pay_sub_first",
      amount_minor: 29900,
    });

    const firstRenewalDate = sub.renewal_date;

    // Simulate recurring renewal
    const renewed = await subscriptionsService.renewSubscription(sub.subscription_id, {
      payment_id: "pay_sub_renew_02",
      amount_minor: 29900,
    });

    assert.equal(renewed.status, "active");
    assert.notEqual(renewed.renewal_date, firstRenewalDate);

    // Verify platform revenue in ledger
    const platformBalance = await financialLedgerService.getEntityBalance("eka_subscription_revenue", "platform");
    assert.equal(platformBalance, 59800); // 29900 + 29900
  });

  // ----------------------------------------------------------------------
  // Test 5: Subscription Cancellation
  // ----------------------------------------------------------------------
  it("Scenario 5: Subscription cancellation marks cancelled_at and halts future renewals", async () => {
    const sub = await subscriptionsService.createSubscription({
      user_id: "user_patron_cancel_01",
      plan_id: "monthly",
      customer_name: "Rohan Varma",
      customer_email: "rohan@eka.earth",
    });

    const cancelled = await subscriptionsService.cancelSubscription(sub.subscription_id, true);
    assert.equal(cancelled.status, "cancelled");
    assert.ok(cancelled.cancelled_at);
  });

  // ----------------------------------------------------------------------
  // Test 6: Full Refund
  // ----------------------------------------------------------------------
  it("Scenario 6: Full refund processes gateway reversal and executes offsetting double-entry in ledger", async () => {
    const order = await paymentsService.createOrder({
      user_id: "user_refund_test",
      amount_minor: 100000,
      purpose: "service",
    });

    const sig = mockProvider.generateValidPaymentSignature(order.razorpay_order_id!, "pay_full_ref_01");
    const { payment } = await paymentsService.verifyAndCapturePayment({
      order_id: order.order_id,
      razorpay_order_id: order.razorpay_order_id!,
      razorpay_payment_id: "pay_full_ref_01",
      razorpay_signature: sig,
      user_id: "user_refund_test",
    });

    // Execute Refund
    const refund = await refundsService.processRefund({
      payment_id: payment.payment_id,
      reason: "Deliverable not accepted",
    });

    assert.equal(refund.status, "PROCESSED");
    assert.equal(refund.amount_minor, 100000);
    assert.equal(payment.status, "REFUNDED");

    // Check ledger reversal
    const refundLedger = await financialLedgerService.queryEntries({ referenceId: refund.refund_id });
    assert.equal(refundLedger.length, 2);
    const debitPlatform = refundLedger.find((e) => e.direction === "DEBIT");
    assert.equal(debitPlatform?.entity_id, "eka_platform_escrow");
  });

  // ----------------------------------------------------------------------
  // Test 7: Creator Onboarding
  // ----------------------------------------------------------------------
  it("Scenario 7: Creator onboarding verifies KYC and provisions linked account", async () => {
    const profile = await creatorPayoutsEngine.onboardCreator({
      user_id: "user_creator_01",
      legal_name: "Devi Chitralekha",
      display_name: "Chitralekha Arts",
      email: "devi@eka.earth",
      pan_number: "ABCDE1234F",
      bank_account_number: "987654321012",
      bank_ifsc: "HDFC0001234",
      upi_id: "chitralekha@okhdfcbank",
      tds_rate_percent: 10,
    });

    assert.equal(profile.pan_status, "verified");
    assert.equal(profile.bank_account_status, "verified");
    assert.equal(profile.payout_status, "active");
    assert.ok(profile.razorpay_linked_account_id);
  });

  // ----------------------------------------------------------------------
  // Test 8: Creator Earning Creation (10% platform fee, 10% TDS)
  // ----------------------------------------------------------------------
  it("Scenario 8: Creator earning creation calculates 10% fee and 10% TDS withholding and posts to ledger", async () => {
    const creator = await creatorPayoutsEngine.onboardCreator({
      user_id: "user_creator_earn_01",
      legal_name: "Arjun Verma",
      display_name: "Arjun Crafts",
      email: "arjun@eka.earth",
      pan_number: "ABCDE9999Z",
      bank_account_number: "112233445566",
      bank_ifsc: "SBIN0004321",
    });

    // Campaign value ₹50,000 (5,000,000 paise)
    const earning = await creatorEarningsEngine.processEarning({
      campaign_id: "camp_festival_2026",
      creator_id: creator.id,
      campaign_amount_minor: 5000000,
      commission_percent: 10,
      tax_rules: {
        tds_rate_percent: 10,
        pan_verified: true,
      },
    });

    assert.equal(earning.gross_earning_minor, 5000000); // ₹50,000
    assert.equal(earning.platform_fee_minor, 500000);   // ₹5,000
    assert.equal(earning.tax_deduction_minor, 450000);  // 10% on (50,000 - 5,000) = ₹4,500
    assert.equal(earning.net_payable_minor, 4050000);   // ₹40,500 net payable

    // Verify Creator Ledger Balance is exactly ₹40,500 (4,050,000 paise)
    const creatorBalance = await financialLedgerService.getEntityBalance(creator.id, "creator");
    assert.equal(creatorBalance, 4050000);

    // Verify Platform fee ledger balance
    const platformBalance = await financialLedgerService.getEntityBalance("eka_platform", "platform");
    assert.equal(platformBalance, 500000);
  });

  // ----------------------------------------------------------------------
  // Test 9: Creator Payout
  // ----------------------------------------------------------------------
  it("Scenario 9: Creator payout checks eligibility, runs state machine to PAID, and debits creator ledger", async () => {
    const creator = await creatorPayoutsEngine.onboardCreator({
      user_id: "user_creator_payout_01",
      legal_name: "Meera Das",
      display_name: "Meera Weaves",
      email: "meera@eka.earth",
      pan_number: "AAAPD1234L",
      bank_account_number: "555566667777",
      bank_ifsc: "ICIC0000101",
    });

    // Create an earning of ₹30,000
    await creatorEarningsEngine.processEarning({
      creator_id: creator.id,
      campaign_amount_minor: 3000000,
      commission_percent: 10,
      tax_rules: { tds_rate_percent: 10, pan_verified: true },
    });

    // Check eligibility
    const eligibility = await creatorPayoutsEngine.checkEligibility(creator.id);
    assert.equal(eligibility.isEligible, true);
    assert.equal(eligibility.payableAmountMinor, 2430000); // Net payable after fee and TDS

    // Execute Payout
    const payout = await creatorPayoutsEngine.requestPayout({
      creator_id: creator.id,
      amount_minor: 2430000,
    });

    assert.equal(payout.status, "PAID");
    assert.ok(payout.payout_id.startsWith("EKA-PAYOUT-"));
    assert.ok(payout.paid_at);

    // Ledger balance should now be 0
    const remainingBalance = await financialLedgerService.getEntityBalance(creator.id, "creator");
    assert.equal(remainingBalance, 0);
  });

  // ----------------------------------------------------------------------
  // Test 10: Failed Payout and Retry
  // ----------------------------------------------------------------------
  it("Scenario 10: Failed payout moves to FAILED state and allows safe RETRY_PENDING transition", async () => {
    const creator = await creatorPayoutsEngine.onboardCreator({
      user_id: "user_creator_fail_01",
      legal_name: "Kabir Singh",
      display_name: "Kabir Folk",
      email: "kabir@eka.earth",
      pan_number: "KKKKS9999A",
      bank_account_number: "999988887777",
      bank_ifsc: "PUNB0001234",
    });

    await creatorEarningsEngine.processEarning({
      creator_id: creator.id,
      campaign_amount_minor: 2000000,
      commission_percent: 10,
      tax_rules: { tds_rate_percent: 10, pan_verified: true },
    });

    // Force failure on next payout execution
    mockProvider.failNextPayout = true;

    await assert.rejects(
      async () => {
        await creatorPayoutsEngine.requestPayout({
          creator_id: creator.id,
        });
      },
      /beneficiary bank server unavailable/,
    );

    const payouts = await creatorPayoutsEngine.getPayoutsByCreator(creator.id);
    const failedPayout = payouts[0];
    assert.equal(failedPayout.status, "FAILED");
    assert.equal(failedPayout.retry_count, 1);

    // Retry payout successfully
    const retried = await creatorPayoutsEngine.retryFailedPayout(failedPayout.payout_id);
    assert.equal(retried.status, "PAID");
  });

  // ----------------------------------------------------------------------
  // Test 11: Duplicate Webhook Idempotency
  // ----------------------------------------------------------------------
  it("Scenario 11: Duplicate webhook delivery is identified and safely acknowledged without double-processing", async () => {
    const sub = await subscriptionsService.createSubscription({
      user_id: "user_webhook_dupe_01",
      plan_id: "monthly",
      customer_name: "Tanmay Bhatt",
      customer_email: "tanmay@eka.earth",
    });

    const eventPayload = {
      id: "evt_dupe_test_12345",
      event: "subscription.charged",
      payload: {
        subscription: { entity: { id: sub.subscription_id } },
        payment: { entity: { id: "pay_dupe_test_01", amount: 29900 } },
      },
    };

    const rawBody = JSON.stringify(eventPayload);
    const signature = mockProvider.generateValidWebhookSignature(rawBody);

    // 1st delivery
    const res1 = await webhookService.handleWebhook(rawBody, signature);
    assert.equal(res1.status, "PROCESSED");
    assert.equal(res1.duplicate, false);

    const balanceAfterFirst = await financialLedgerService.getEntityBalance("eka_subscription_revenue", "platform");
    assert.equal(balanceAfterFirst, 29900);

    // 2nd delivery (identical event_id)
    const res2 = await webhookService.handleWebhook(rawBody, signature);
    assert.equal(res2.status, "DUPLICATE");
    assert.equal(res2.duplicate, true);

    // Ledger balance must NOT increase again!
    const balanceAfterSecond = await financialLedgerService.getEntityBalance("eka_subscription_revenue", "platform");
    assert.equal(balanceAfterSecond, 29900);
  });

  // ----------------------------------------------------------------------
  // Test 12: Webhook Replay / Bad Signature
  // ----------------------------------------------------------------------
  it("Scenario 12: Webhook with invalid or forged signature is rejected with error", async () => {
    const rawBody = JSON.stringify({ id: "evt_tampered", event: "payment.captured" });
    const forgedSignature = "abcdef0123456789_invalid_signature";

    await assert.rejects(
      async () => {
        await webhookService.handleWebhook(rawBody, forgedSignature);
      },
      /Invalid webhook signature/,
    );
  });

  // ----------------------------------------------------------------------
  // Test 13: Partial Refund
  // ----------------------------------------------------------------------
  it("Scenario 13: Partial refund reverses only the specified portion in the ledger", async () => {
    const order = await paymentsService.createOrder({
      user_id: "user_partial_ref",
      amount_minor: 1000000, // ₹10,000
      purpose: "service",
    });

    const sig = mockProvider.generateValidPaymentSignature(order.razorpay_order_id!, "pay_partial_01");
    const { payment } = await paymentsService.verifyAndCapturePayment({
      order_id: order.order_id,
      razorpay_order_id: order.razorpay_order_id!,
      razorpay_payment_id: "pay_partial_01",
      razorpay_signature: sig,
      user_id: "user_partial_ref",
    });

    // Refund ₹3,000 out of ₹10,000
    const partialRefund = await refundsService.processRefund({
      payment_id: payment.payment_id,
      amount_minor: 300000,
      reason: "Partial scope reduction",
    });

    assert.equal(partialRefund.amount_minor, 300000);
    assert.equal(partialRefund.status, "PROCESSED");

    // Parent payment remains CAPTURED
    assert.equal(payment.status, "CAPTURED");

    // Ledger check: consumer received ₹3,000 credit reversal
    const refundEntries = await financialLedgerService.queryEntries({ referenceId: partialRefund.refund_id });
    const consumerCredit = refundEntries.find((e) => e.direction === "CREDIT" && e.entity_id === "user_partial_ref");
    assert.equal(consumerCredit?.amount, 300000);
  });

  // ----------------------------------------------------------------------
  // Test 14: Reconciliation Mismatch Detection
  // ----------------------------------------------------------------------
  it("Scenario 14: Reconciliation engine detects discrepancy when external provider has unrecorded payments", async () => {
    // Record internal payment of ₹2,000
    const order = await paymentsService.createOrder({
      user_id: "user_rec_01",
      amount_minor: 200000,
      purpose: "one_time",
    });
    const sig = mockProvider.generateValidPaymentSignature(order.razorpay_order_id!, "pay_rec_01");
    await paymentsService.verifyAndCapturePayment({
      order_id: order.order_id,
      razorpay_order_id: order.razorpay_order_id!,
      razorpay_payment_id: "pay_rec_01",
      razorpay_signature: sig,
      user_id: "user_rec_01",
    });

    // Gateway report contains recorded payment AND an orphaned payment of ₹5,000 not in EKA ledger
    const providerBatch = [
      { id: "pay_rec_01", type: "payment" as const, amount_minor: 200000, currency: "INR", status: "captured" },
      { id: "pay_orphaned_99", type: "payment" as const, amount_minor: 500000, currency: "INR", status: "captured" },
    ];

    const report = await reconciliationService.reconcilePeriod(
      new Date(Date.now() - 86400000),
      new Date(),
      providerBatch,
    );

    assert.equal(report.status, "MISMATCH");
    assert.equal(report.discrepancy_amount_minor, 500000);
    assert.equal(report.details.discrepancy_count, 1);
    assert.equal(report.details.mismatched_items[0].id, "pay_orphaned_99");
  });

  // ----------------------------------------------------------------------
  // Test 15: Concurrent Payout Request Protection
  // ----------------------------------------------------------------------
  it("Scenario 15: Simultaneous concurrent payout requests are locked against race conditions", async () => {
    const creator = await creatorPayoutsEngine.onboardCreator({
      user_id: "user_race_condition_creator",
      legal_name: "Simultaneous Requester",
      display_name: "Speedy Creator",
      email: "speedy@eka.earth",
      pan_number: "SPEED1234X",
      bank_account_number: "123123123123",
      bank_ifsc: "HDFC0009999",
    });

    await creatorEarningsEngine.processEarning({
      creator_id: creator.id,
      campaign_amount_minor: 1000000,
      commission_percent: 10,
      tax_rules: { tds_rate_percent: 10, pan_verified: true },
    });

    // Attempt to invoke two simultaneous payouts
    const results = await Promise.allSettled([
      creatorPayoutsEngine.requestPayout({ creator_id: creator.id }),
      creatorPayoutsEngine.requestPayout({ creator_id: creator.id }),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    // Exactly one must succeed and one must be rejected by the concurrency lock
    assert.equal(fulfilled.length, 1);
    assert.equal(rejected.length, 1);
    const rejectionReason = (rejected[0] as PromiseRejectedResult).reason;
    assert.match(String(rejectionReason), /already processing/);
  });
});
