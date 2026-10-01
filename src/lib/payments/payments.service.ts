/**
 * EKA Platform - Payments Service
 * 
 * Manages orders and one-time payments for brand campaigns, consultations, and episodes.
 * Strictly verifies server-side cryptographic signatures before marking transactions as successful.
 * Never trusts frontend redirects or client states alone.
 */

import { randomUUID } from "node:crypto";
import type {
  Order,
  Payment,
  PaymentPurpose,
  Currency,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "./types";
import { getPaymentProvider } from "./providers";
import { financialLedgerService } from "./ledger.service";

export interface CreateOrderInput {
  user_id?: string;
  customer_id?: string;
  amount_minor: number; // in paise
  purpose: PaymentPurpose;
  currency?: Currency;
  notes?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface VerifyPaymentInput {
  order_id: string; // EKA order id or razorpay order id
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  user_id?: string;
}

const inMemoryOrders = new Map<string, Order>();
const inMemoryPayments = new Map<string, Payment>();

export class PaymentsService {
  public generateOrderId(): string {
    const suffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `EKA-ORD-${suffix}`;
  }

  public generatePaymentId(): string {
    const suffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `EKA-PAY-${suffix}`;
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    if (input.amount_minor <= 0 || !Number.isInteger(input.amount_minor)) {
      throw new Error(`Invalid order amount: ${input.amount_minor}. Must be positive integer paise.`);
    }

    const orderId = this.generateOrderId();
    const receipt = `rcpt_${orderId.toLowerCase()}`;
    const currency = input.currency ?? "INR";

    const provider = getPaymentProvider();
    const providerOrder = await provider.createOrder({
      amount: input.amount_minor,
      currency,
      receipt,
      notes: input.notes,
    });

    const now = new Date().toISOString();
    const order: Order = {
      id: randomUUID(),
      order_id: orderId,
      user_id: input.user_id,
      customer_id: input.customer_id,
      amount_minor: input.amount_minor,
      currency,
      receipt,
      razorpay_order_id: providerOrder.id,
      status: "CREATED",
      purpose: input.purpose,
      notes: input.notes,
      metadata: input.metadata,
      created_at: now,
      updated_at: now,
    };

    inMemoryOrders.set(order.id, order);
    inMemoryOrders.set(order.order_id, order);
    if (order.razorpay_order_id) {
      inMemoryOrders.set(order.razorpay_order_id, order);
    }

    return order;
  }

  /**
   * Verifies HMAC signature, fetches gateway confirmation, and captures payment.
   * Never marks successful unless signature passes.
   */
  async verifyAndCapturePayment(input: VerifyPaymentInput): Promise<{ payment: Payment; order: Order }> {
    const order = inMemoryOrders.get(input.order_id) ?? inMemoryOrders.get(input.razorpay_order_id);
    if (!order) {
      throw new Error(`Order ${input.order_id} not found.`);
    }

    const provider = getPaymentProvider();
    const isValidSignature = provider.verifyPaymentSignature({
      razorpay_order_id: input.razorpay_order_id,
      razorpay_payment_id: input.razorpay_payment_id,
      razorpay_signature: input.razorpay_signature,
    });

    if (!isValidSignature) {
      throw new Error("Cryptographic signature verification failed: Possible payment tampering or spoofing.");
    }

    // Capture payment with provider
    const captured = await provider.capturePayment(input.razorpay_payment_id, order.amount_minor, order.currency);

    const paymentId = this.generatePaymentId();
    const now = new Date().toISOString();

    const payment: Payment = {
      id: randomUUID(),
      payment_id: paymentId,
      order_id: order.order_id,
      customer_id: order.customer_id,
      user_id: input.user_id ?? order.user_id,
      amount_minor: order.amount_minor,
      currency: order.currency,
      status: "CAPTURED",
      method: (captured.method as PaymentMethod) ?? "upi",
      razorpay_payment_id: input.razorpay_payment_id,
      razorpay_order_id: input.razorpay_order_id,
      razorpay_signature: input.razorpay_signature,
      fee_minor: captured.fee ?? Math.round(order.amount_minor * 0.02),
      tax_minor: captured.tax ?? Math.round(order.amount_minor * 0.02 * 0.18),
      captured_at: now,
      created_at: now,
      updated_at: now,
    };

    order.status = "PAID";
    order.updated_at = now;

    inMemoryPayments.set(payment.id, payment);
    inMemoryPayments.set(payment.payment_id, payment);
    if (payment.razorpay_payment_id) {
      inMemoryPayments.set(payment.razorpay_payment_id, payment);
    }

    // Post Double-Entry Ledger Posting: Consumer/Brand paid EKA Platform Escrow
    const payerId = payment.user_id ?? "guest_checkout";
    await financialLedgerService.recordDoubleEntry({
      source: order.purpose === "brand_campaign" ? "brand_campaign" : "one_time",
      reference_id: payment.payment_id,
      amount_minor: payment.amount_minor,
      currency: payment.currency,
      debitEntity: { id: payerId, type: order.purpose === "brand_campaign" ? "brand" : "consumer" },
      creditEntity: { id: "eka_platform_escrow", type: "platform" },
      metadata: {
        order_id: order.order_id,
        payment_id: payment.payment_id,
        razorpay_payment_id: payment.razorpay_payment_id,
      },
    });

    return { payment, order };
  }

  async markPaymentFailed(
    orderIdentifier: string,
    errorCode: string,
    errorDescription: string,
  ): Promise<Payment> {
    const order = inMemoryOrders.get(orderIdentifier);
    const paymentId = this.generatePaymentId();
    const now = new Date().toISOString();

    const payment: Payment = {
      id: randomUUID(),
      payment_id: paymentId,
      order_id: order?.order_id,
      amount_minor: order?.amount_minor ?? 0,
      currency: order?.currency ?? "INR",
      status: "FAILED",
      method: "unknown",
      error_code: errorCode,
      error_description: errorDescription,
      fee_minor: 0,
      tax_minor: 0,
      created_at: now,
      updated_at: now,
    };

    inMemoryPayments.set(payment.id, payment);
    inMemoryPayments.set(payment.payment_id, payment);

    return payment;
  }

  getOrder(orderId: string): Order | undefined {
    return inMemoryOrders.get(orderId);
  }

  getPayment(paymentId: string): Payment | undefined {
    return inMemoryPayments.get(paymentId);
  }

  clearInMemoryStore(): void {
    inMemoryOrders.clear();
    inMemoryPayments.clear();
  }
}

export const paymentsService = new PaymentsService();
