/**
 * EKA Platform - Refunds Service
 * 
 * Supports full and partial refunds with gateway synchronization and
 * immutable double-entry ledger reversals.
 */

import { randomUUID } from "node:crypto";
import type { Refund, Currency } from "./types";
import { paymentsService } from "./payments.service";
import { getPaymentProvider } from "./providers";
import { financialLedgerService } from "./ledger.service";

export interface ProcessRefundInput {
  payment_id: string; // EKA payment id or razorpay payment id
  amount_minor?: number; // In minor units; if omitted, refunds entire payment
  reason: string;
  notes?: Record<string, string>;
}

const inMemoryRefunds = new Map<string, Refund>();

export class RefundsService {
  public generateRefundId(): string {
    const suffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `EKA-REFUND-${suffix}`;
  }

  async processRefund(input: ProcessRefundInput): Promise<Refund> {
    const payment = paymentsService.getPayment(input.payment_id);
    if (!payment) {
      throw new Error(`Payment ${input.payment_id} not found.`);
    }

    if (payment.status !== "CAPTURED") {
      throw new Error(`Only CAPTURED payments can be refunded. Current status is ${payment.status}.`);
    }

    const refundAmountMinor = input.amount_minor ?? payment.amount_minor;
    if (refundAmountMinor <= 0 || refundAmountMinor > payment.amount_minor) {
      throw new Error(
        `Invalid refund amount ${refundAmountMinor}. Must be between 1 and ${payment.amount_minor} paise.`,
      );
    }

    const provider = getPaymentProvider();
    const providerRefund = await provider.createRefund({
      payment_id: payment.razorpay_payment_id ?? payment.payment_id,
      amount: refundAmountMinor,
      notes: {
        reason: input.reason,
        ...input.notes,
      },
    });

    const refundId = this.generateRefundId();
    const now = new Date().toISOString();

    // Ledger Reversal: Debit Platform Escrow, Credit Consumer
    const recipientId = payment.user_id ?? "guest_checkout";
    const ledgerReversal = await financialLedgerService.recordDoubleEntry({
      source: "refund",
      reference_id: refundId,
      amount_minor: refundAmountMinor,
      currency: payment.currency,
      debitEntity: { id: "eka_platform_escrow", type: "platform" },
      creditEntity: { id: recipientId, type: "consumer" },
      metadata: {
        payment_id: payment.payment_id,
        refund_id: refundId,
        reason: input.reason,
        partial: refundAmountMinor < payment.amount_minor,
      },
    });

    const refund: Refund = {
      id: randomUUID(),
      refund_id: refundId,
      payment_id: payment.payment_id,
      razorpay_refund_id: providerRefund.id,
      razorpay_payment_id: payment.razorpay_payment_id,
      amount_minor: refundAmountMinor,
      currency: payment.currency,
      reason: input.reason,
      status: "PROCESSED",
      reversal_ledger_id: ledgerReversal.transactionId,
      metadata: {
        partial: refundAmountMinor < payment.amount_minor,
      },
      created_at: now,
      updated_at: now,
    };

    if (refundAmountMinor === payment.amount_minor) {
      payment.status = "REFUNDED";
    }

    inMemoryRefunds.set(refund.id, refund);
    inMemoryRefunds.set(refund.refund_id, refund);
    return refund;
  }

  getRefund(refundId: string): Refund | undefined {
    return inMemoryRefunds.get(refundId);
  }

  clearInMemoryStore(): void {
    inMemoryRefunds.clear();
  }
}

export const refundsService = new RefundsService();
