/**
 * EKA Platform - Razorpay Provider Implementation
 * 
 * Interacts with Razorpay's Subscriptions, Orders, Payments, Route, and RazorpayX APIs.
 * Uses HTTP Basic Authentication and HMAC-SHA256 signature verification with timing-safe comparison.
 * Secret keys are strictly maintained on the server and NEVER exposed to frontend code.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
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

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret?: string;
  accountId?: string;
  razorpayxAccountNumber?: string;
  baseUrl?: string;
}

export class RazorpayProvider implements PaymentProvider {
  public readonly name = "razorpay";
  private readonly baseUrl: string;
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly webhookSecret?: string;
  private readonly razorpayxAccountNumber?: string;

  constructor(config?: Partial<RazorpayConfig>) {
    this.keyId = config?.keyId ?? process.env["RAZORPAY_KEY_ID"] ?? "";
    this.keySecret = config?.keySecret ?? process.env["RAZORPAY_KEY_SECRET"] ?? "";
    this.webhookSecret = config?.webhookSecret ?? process.env["RAZORPAY_WEBHOOK_SECRET"] ?? "";
    this.razorpayxAccountNumber = config?.razorpayxAccountNumber ?? process.env["RAZORPAYX_ACCOUNT_NUMBER"] ?? "";
    this.baseUrl = config?.baseUrl ?? "https://api.razorpay.com/v1";
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");
    return `Basic ${credentials}`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.keyId || !this.keySecret) {
      throw new Error("Razorpay credentials missing. Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.");
    }

    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const headers = new Headers(options.headers);
    headers.set("Authorization", this.getAuthHeader());
    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const bodyText = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(bodyText);
    } catch {
      throw new Error(`Razorpay API returned non-JSON response (status ${response.status}): ${bodyText}`);
    }

    if (!response.ok) {
      const errObj = (data as { error?: { description?: string; code?: string } })?.error;
      const errorMsg = errObj?.description ?? `Razorpay request failed with status ${response.status}`;
      throw new Error(`Razorpay Error [${errObj?.code ?? response.status}]: ${errorMsg}`);
    }

    return data as T;
  }

  // ----------------------------------------------------------------------
  // Customers
  // ----------------------------------------------------------------------

  async createCustomer(params: CreateCustomerParams): Promise<ProviderCustomerResult> {
    const res = await this.request<{ id: string; email: string; contact?: string }>("/customers", {
      method: "POST",
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        contact: params.contact,
        notes: params.notes,
      }),
    });

    return {
      id: res.id,
      email: res.email,
      contact: res.contact,
    };
  }

  // ----------------------------------------------------------------------
  // Plans & Subscriptions
  // ----------------------------------------------------------------------

  async createPlan(params: CreatePlanParams): Promise<ProviderPlanResult> {
    const res = await this.request<{
      id: string;
      item: { name: string; amount: number; currency: string };
      period: string;
      interval: number;
    }>("/plans", {
      method: "POST",
      body: JSON.stringify({
        period: params.period,
        interval: params.interval,
        item: params.item,
      }),
    });

    return {
      id: res.id,
      name: res.item.name,
      amount: res.item.amount,
      currency: res.item.currency,
      period: res.period,
      interval: res.interval,
    };
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<ProviderSubscriptionResult> {
    const res = await this.request<{
      id: string;
      plan_id: string;
      status: string;
      short_url?: string;
      current_start?: number;
      current_end?: number;
    }>("/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        plan_id: params.plan_id,
        customer_id: params.customer_id,
        total_count: params.total_count ?? 12,
        quantity: params.quantity ?? 1,
        customer_notify: params.customer_notify ?? 1,
        start_at: params.start_at,
        notes: params.notes,
      }),
    });

    return {
      id: res.id,
      plan_id: res.plan_id,
      status: res.status,
      short_url: res.short_url,
      current_start: res.current_start,
      current_end: res.current_end,
    };
  }

  async cancelSubscription(
    subscriptionId: string,
    cancelAtCycleEnd = false,
  ): Promise<{ id: string; status: string }> {
    const res = await this.request<{ id: string; status: string }>(`/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
      body: JSON.stringify({
        cancel_at_cycle_end: cancelAtCycleEnd ? 1 : 0,
      }),
    });

    return { id: res.id, status: res.status };
  }

  async pauseSubscription(subscriptionId: string): Promise<{ id: string; status: string }> {
    const res = await this.request<{ id: string; status: string }>(`/subscriptions/${subscriptionId}/pause`, {
      method: "POST",
      body: JSON.stringify({
        pause_at: "now",
      }),
    });

    return { id: res.id, status: res.status };
  }

  async resumeSubscription(subscriptionId: string): Promise<{ id: string; status: string }> {
    const res = await this.request<{ id: string; status: string }>(`/subscriptions/${subscriptionId}/resume`, {
      method: "POST",
      body: JSON.stringify({
        resume_at: "now",
      }),
    });

    return { id: res.id, status: res.status };
  }

  // ----------------------------------------------------------------------
  // Orders & Payments
  // ----------------------------------------------------------------------

  async createOrder(params: CreateOrderParams): Promise<ProviderOrderResult> {
    const res = await this.request<{
      id: string;
      amount: number;
      currency: string;
      receipt: string;
      status: string;
    }>("/orders", {
      method: "POST",
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        receipt: params.receipt,
        notes: params.notes,
      }),
    });

    return {
      id: res.id,
      amount: res.amount,
      currency: res.currency,
      receipt: res.receipt,
      status: res.status,
    };
  }

  verifyPaymentSignature(params: VerifySignatureParams): boolean {
    if (!this.keySecret) {
      throw new Error("Cannot verify payment signature: RAZORPAY_KEY_SECRET is not configured.");
    }

    const payload = `${params.razorpay_order_id}|${params.razorpay_payment_id}`;
    const expected = createHmac("sha256", this.keySecret).update(payload).digest("hex");

    const a = Buffer.from(params.razorpay_signature, "utf-8");
    const b = Buffer.from(expected, "utf-8");

    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }

  async capturePayment(paymentId: string, amountMinor: number, currency = "INR"): Promise<ProviderPaymentResult> {
    const res = await this.request<{
      id: string;
      order_id?: string;
      amount: number;
      currency: string;
      status: string;
      method?: string;
      fee?: number;
      tax?: number;
    }>(`/payments/${paymentId}/capture`, {
      method: "POST",
      body: JSON.stringify({
        amount: amountMinor,
        currency,
      }),
    });

    return {
      id: res.id,
      order_id: res.order_id,
      amount: res.amount,
      currency: res.currency,
      status: res.status,
      method: res.method,
      fee: res.fee,
      tax: res.tax,
    };
  }

  async fetchPayment(paymentId: string): Promise<ProviderPaymentResult> {
    const res = await this.request<{
      id: string;
      order_id?: string;
      amount: number;
      currency: string;
      status: string;
      method?: string;
      fee?: number;
      tax?: number;
      error_code?: string;
      error_description?: string;
    }>(`/payments/${paymentId}`, {
      method: "GET",
    });

    return {
      id: res.id,
      order_id: res.order_id,
      amount: res.amount,
      currency: res.currency,
      status: res.status,
      method: res.method,
      fee: res.fee,
      tax: res.tax,
      error_code: res.error_code,
      error_description: res.error_description,
    };
  }

  // ----------------------------------------------------------------------
  // Refunds
  // ----------------------------------------------------------------------

  async createRefund(params: CreateRefundParams): Promise<ProviderRefundResult> {
    const res = await this.request<{
      id: string;
      payment_id: string;
      amount: number;
      currency: string;
      status: string;
    }>(`/payments/${params.payment_id}/refund`, {
      method: "POST",
      body: JSON.stringify({
        amount: params.amount,
        notes: params.notes,
      }),
    });

    return {
      id: res.id,
      payment_id: res.payment_id,
      amount: res.amount,
      currency: res.currency,
      status: res.status,
    };
  }

  // ----------------------------------------------------------------------
  // Razorpay Route (Marketplace Splitting to Linked Accounts)
  // ----------------------------------------------------------------------

  async transferToLinkedAccount(params: RouteTransferParams): Promise<RouteTransferResult> {
    const res = await this.request<{
      id: string;
      recipient: string;
      amount: number;
      currency: string;
      status: string;
    }>("/transfers", {
      method: "POST",
      body: JSON.stringify({
        account: params.account,
        amount: params.amount,
        currency: params.currency,
        notes: params.notes,
      }),
    });

    return {
      id: res.id,
      recipient: res.recipient,
      amount: res.amount,
      currency: res.currency,
      status: res.status,
    };
  }

  // ----------------------------------------------------------------------
  // RazorpayX (Direct Bank / UPI Payouts)
  // ----------------------------------------------------------------------

  async createPayout(params: CreatePayoutParams): Promise<ProviderPayoutResult> {
    const accountNumber = params.account_number ?? this.razorpayxAccountNumber;
    if (!accountNumber) {
      throw new Error("RazorpayX Account Number missing. Specify RAZORPAYX_ACCOUNT_NUMBER.");
    }

    const res = await this.request<{
      id: string;
      amount: number;
      currency: string;
      status: string;
      utr?: string;
      mode: string;
    }>("/payouts", {
      method: "POST",
      body: JSON.stringify({
        account_number: accountNumber,
        fund_account_id: params.fund_account_id,
        amount: params.amount,
        currency: params.currency,
        mode: params.mode,
        purpose: params.purpose,
        notes: params.notes,
      }),
    });

    return {
      id: res.id,
      amount: res.amount,
      currency: res.currency,
      status: res.status,
      utr: res.utr,
      mode: res.mode,
    };
  }

  // ----------------------------------------------------------------------
  // Webhook Signature Verification
  // ----------------------------------------------------------------------

  verifyWebhookSignature(rawBody: string, signature: string, secret?: string): boolean {
    const key = secret ?? this.webhookSecret;
    if (!key) {
      throw new Error("Cannot verify webhook: RAZORPAY_WEBHOOK_SECRET is not configured.");
    }

    const expected = createHmac("sha256", key).update(rawBody).digest("hex");
    const a = Buffer.from(signature, "utf-8");
    const b = Buffer.from(expected, "utf-8");

    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }
}
