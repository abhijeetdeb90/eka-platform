/**
 * EKA Platform - Mock Payment Provider
 * 
 * Provides deterministic in-memory simulation of Razorpay for sandboxed integration tests.
 * Supports simulating successes, failures, signature checks, webhooks, Route transfers and Payouts.
 */

import { createHmac } from "node:crypto";
import type {
  PaymentProvider,
  CreateCustomerParams,
  ProviderCustomerResult,
  CreatePlanParams,
  ProviderPlanResult,
  CreateSubscriptionParams,
  ProviderSubscriptionResult,
  CreateOrderParams,
  ProviderOrderResult,
  VerifySignatureParams,
  ProviderPaymentResult,
  CreateRefundParams,
  ProviderRefundResult,
  RouteTransferParams,
  RouteTransferResult,
  CreatePayoutParams,
  ProviderPayoutResult,
} from "./payment-provider.interface";

export class MockPaymentProvider implements PaymentProvider {
  public readonly name = "mock_provider";
  public mockSecret = "mock_secret_key_12345";
  public mockWebhookSecret = "mock_webhook_secret_67890";

  public failNextPayment = false;
  public failNextPayout = false;

  private customers = new Map<string, ProviderCustomerResult>();
  private plans = new Map<string, ProviderPlanResult>();
  private subscriptions = new Map<string, ProviderSubscriptionResult>();
  private orders = new Map<string, ProviderOrderResult>();
  private payments = new Map<string, ProviderPaymentResult>();
  private refunds = new Map<string, ProviderRefundResult>();
  private transfers = new Map<string, RouteTransferResult>();
  private payouts = new Map<string, ProviderPayoutResult>();

  async createCustomer(params: CreateCustomerParams): Promise<ProviderCustomerResult> {
    const id = `cust_mock_${Math.random().toString(36).substring(2, 9)}`;
    const cust: ProviderCustomerResult = { id, email: params.email, contact: params.contact };
    this.customers.set(id, cust);
    return cust;
  }

  async createPlan(params: CreatePlanParams): Promise<ProviderPlanResult> {
    const id = `plan_mock_${Math.random().toString(36).substring(2, 9)}`;
    const plan: ProviderPlanResult = {
      id,
      name: params.item.name,
      amount: params.item.amount,
      currency: params.item.currency,
      period: params.period,
      interval: params.interval,
    };
    this.plans.set(id, plan);
    return plan;
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<ProviderSubscriptionResult> {
    const id = `sub_mock_${Math.random().toString(36).substring(2, 9)}`;
    const nowSec = Math.floor(Date.now() / 1000);
    const sub: ProviderSubscriptionResult = {
      id,
      plan_id: params.plan_id,
      status: "created",
      short_url: `https://rzp.io/i/${id}`,
      current_start: nowSec,
      current_end: nowSec + 30 * 86400,
    };
    this.subscriptions.set(id, sub);
    return sub;
  }

  async cancelSubscription(
    subscriptionId: string,
    _cancelAtCycleEnd = false,
  ): Promise<{ id: string; status: string }> {
    const sub = this.subscriptions.get(subscriptionId);
    if (sub) {
      sub.status = "cancelled";
    }
    return { id: subscriptionId, status: "cancelled" };
  }

  async pauseSubscription(subscriptionId: string): Promise<{ id: string; status: string }> {
    const sub = this.subscriptions.get(subscriptionId);
    if (sub) {
      sub.status = "paused";
    }
    return { id: subscriptionId, status: "paused" };
  }

  async resumeSubscription(subscriptionId: string): Promise<{ id: string; status: string }> {
    const sub = this.subscriptions.get(subscriptionId);
    if (sub) {
      sub.status = "active";
    }
    return { id: subscriptionId, status: "active" };
  }

  async createOrder(params: CreateOrderParams): Promise<ProviderOrderResult> {
    const id = `order_mock_${Math.random().toString(36).substring(2, 9)}`;
    const order: ProviderOrderResult = {
      id,
      amount: params.amount,
      currency: params.currency,
      receipt: params.receipt,
      status: "created",
    };
    this.orders.set(id, order);
    return order;
  }

  generateValidPaymentSignature(orderId: string, paymentId: string): string {
    return createHmac("sha256", this.mockSecret).update(`${orderId}|${paymentId}`).digest("hex");
  }

  generateValidWebhookSignature(rawBody: string, secret?: string): string {
    const key = secret ?? this.mockWebhookSecret;
    return createHmac("sha256", key).update(rawBody).digest("hex");
  }

  verifyPaymentSignature(params: VerifySignatureParams): boolean {
    const expected = this.generateValidPaymentSignature(params.razorpay_order_id, params.razorpay_payment_id);
    return expected === params.razorpay_signature;
  }

  async capturePayment(paymentId: string, amountMinor: number, currency = "INR"): Promise<ProviderPaymentResult> {
    if (this.failNextPayment) {
      this.failNextPayment = false;
      throw new Error("Payment capture simulated failure (insufficient funds or bank rejection)");
    }

    const payment: ProviderPaymentResult = {
      id: paymentId,
      amount: amountMinor,
      currency,
      status: "captured",
      method: "upi",
      fee: Math.round(amountMinor * 0.02), // 2% gateway processing fee
      tax: Math.round(amountMinor * 0.02 * 0.18), // 18% GST on fee
    };
    this.payments.set(paymentId, payment);
    return payment;
  }

  async fetchPayment(paymentId: string): Promise<ProviderPaymentResult> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      return {
        id: paymentId,
        amount: 100000,
        currency: "INR",
        status: "captured",
      };
    }
    return payment;
  }

  async createRefund(params: CreateRefundParams): Promise<ProviderRefundResult> {
    const id = `rfnd_mock_${Math.random().toString(36).substring(2, 9)}`;
    const refund: ProviderRefundResult = {
      id,
      payment_id: params.payment_id,
      amount: params.amount ?? 10000,
      currency: "INR",
      status: "processed",
    };
    this.refunds.set(id, refund);
    return refund;
  }

  async transferToLinkedAccount(params: RouteTransferParams): Promise<RouteTransferResult> {
    const id = `trf_mock_${Math.random().toString(36).substring(2, 9)}`;
    const trf: RouteTransferResult = {
      id,
      recipient: params.account,
      amount: params.amount,
      currency: params.currency,
      status: "processed",
    };
    this.transfers.set(id, trf);
    return trf;
  }

  async createPayout(params: CreatePayoutParams): Promise<ProviderPayoutResult> {
    if (this.failNextPayout) {
      this.failNextPayout = false;
      throw new Error("Payout execution failed: beneficiary bank server unavailable");
    }

    const id = `pout_mock_${Math.random().toString(36).substring(2, 9)}`;
    const payout: ProviderPayoutResult = {
      id,
      amount: params.amount,
      currency: params.currency,
      status: "processed",
      utr: `UTR${Date.now()}`,
      mode: params.mode,
    };
    this.payouts.set(id, payout);
    return payout;
  }

  verifyWebhookSignature(rawBody: string, signature: string, secret?: string): boolean {
    const expected = this.generateValidWebhookSignature(rawBody, secret);
    return expected === signature;
  }
}
