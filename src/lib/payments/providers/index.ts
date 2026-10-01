/**
 * EKA Platform - Payment Provider Registry & Factory
 */

import type { PaymentProvider } from "./payment-provider.interface";
import { RazorpayProvider } from "./razorpay.provider";
import { MockPaymentProvider } from "./mock.provider";

export * from "./payment-provider.interface";
export * from "./razorpay.provider";
export * from "./mock.provider";

let defaultProviderInstance: PaymentProvider | null = null;

export function getPaymentProvider(providerName?: string): PaymentProvider {
  if (providerName) {
    if (providerName === "mock") return new MockPaymentProvider();
    if (providerName === "razorpay") return new RazorpayProvider();
    throw new Error(`Unsupported payment provider: ${providerName}`);
  }

  if (defaultProviderInstance) {
    return defaultProviderInstance;
  }

  const chosen = process.env["PAYMENT_PROVIDER"] ?? "razorpay";
  if (chosen === "mock" || process.env["NODE_ENV"] === "test_mock") {
    defaultProviderInstance = new MockPaymentProvider();
    return defaultProviderInstance;
  }

  if (chosen === "razorpay") {
    defaultProviderInstance = new RazorpayProvider();
    return defaultProviderInstance;
  }

  throw new Error(`Unsupported payment provider: ${chosen}`);
}

export function setPaymentProvider(provider: PaymentProvider): void {
  defaultProviderInstance = provider;
}
