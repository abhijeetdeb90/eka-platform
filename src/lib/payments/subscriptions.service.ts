/**
 * EKA Platform - Subscriptions Service
 * 
 * Manages recurring billing intervals (monthly, quarterly, yearly),
 * plan transitions (upgrade/downgrade), lifecycle states (pause/resume/cancel),
 * failed payments, and double-entry subscription revenue recognition.
 */

import { randomUUID } from "node:crypto";
import type {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  Currency,
} from "./types";
import { getPaymentProvider } from "./providers";
import { financialLedgerService } from "./ledger.service";

export interface CreateSubscriptionInput {
  user_id: string;
  plan_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | undefined;
  gstin?: string | undefined;
}

export interface UpgradePlanInput {
  subscription_id: string;
  new_plan_id: string;
}

const inMemorySubscriptions = new Map<string, Subscription>();
const inMemoryPlans: SubscriptionPlan[] = [
  {
    id: "monthly",
    code: "EKA_PATRON_MONTHLY",
    name: "Monthly EKA+ Membership",
    description: "Full access to cultural intelligence, AI exploration, Creator Studio, and community circles.",
    amount_minor: 49900, // ₹499
    currency: "INR",
    cadence: "monthly",
    period_days: 30,
    is_active: true,
    features: ["cultural_library", "ai_exploration", "community_circles"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "quarterly",
    code: "EKA_PATRON_QUARTERLY",
    name: "Quarterly Patron Membership",
    description: "Seasonal rhythm alignment with seasonal workshops and heritage previews.",
    amount_minor: 79900, // ₹799
    currency: "INR",
    cadence: "quarterly",
    period_days: 90,
    is_active: true,
    features: ["cultural_library", "seasonal_workshops", "heritage_previews"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "annual",
    code: "EKA_PATRON_ANNUAL",
    name: "Annual Patron Membership",
    description: "Full annual cycle of the twelve themes with VIP invitations.",
    amount_minor: 299000, // ₹2,990
    currency: "INR",
    cadence: "annual",
    period_days: 365,
    is_active: true,
    features: ["full_annual_cycle", "vip_invitations", "peace_fund_patron"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "creator_pro",
    code: "EKA_CREATOR_PRO",
    name: "Creator Studio Pro",
    description: "Master Artisan Workspace with Epistemic Tier tagging & priority settlements.",
    amount_minor: 49900, // ₹499
    currency: "INR",
    cadence: "monthly",
    period_days: 30,
    is_active: true,
    features: ["artisan_studio", "epistemic_tags", "priority_settlement"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "brand_growth",
    code: "EKA_BRAND_GROWTH",
    name: "Brand Growth OS",
    description: "Trend Radar, Brand Brain AI, Autopilot campaigns and verified creator matching.",
    amount_minor: 999900, // ₹9,999
    currency: "INR",
    cadence: "monthly",
    period_days: 30,
    is_active: true,
    features: ["trend_radar", "brand_brain_ai", "creator_marketplace"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class SubscriptionsService {
  getPlans(): SubscriptionPlan[] {
    return inMemoryPlans;
  }

  getPlanById(planId: string): SubscriptionPlan | undefined {
    return inMemoryPlans.find((p) => p.id === planId || p.code === planId);
  }

  async createSubscription(input: CreateSubscriptionInput): Promise<Subscription> {
    const plan = this.getPlanById(input.plan_id);
    if (!plan) {
      throw new Error(`Invalid plan ID: ${input.plan_id}`);
    }

    const provider = getPaymentProvider();

    // 1. Create or retrieve gateway customer
    const providerCustomer = await provider.createCustomer({
      name: input.customer_name,
      email: input.customer_email,
      contact: input.customer_phone,
      notes: { user_id: input.user_id, gstin: input.gstin ?? "" },
    });

    // 2. Initialize recurring subscription on gateway
    const providerSub = await provider.createSubscription({
      plan_id: plan.razorpay_plan_id ?? `plan_${plan.id}`,
      customer_id: providerCustomer.id,
      notes: { user_id: input.user_id, plan_id: plan.id },
    });

    const now = new Date();
    const renewalDate = new Date(now.getTime() + plan.period_days * 86400 * 1000);

    const subscription: Subscription = {
      id: randomUUID(),
      user_id: input.user_id,
      customer_id: providerCustomer.id,
      razorpay_customer_id: providerCustomer.id,
      subscription_id: `EKA-SUB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      razorpay_subscription_id: providerSub.id,
      plan_id: plan.id,
      status: "created",
      amount_minor: plan.amount_minor,
      currency: plan.currency,
      start_date: now.toISOString(),
      renewal_date: renewalDate.toISOString(),
      failure_count: 0,
      short_url: providerSub.short_url,
      metadata: { gstin: input.gstin },
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    inMemorySubscriptions.set(subscription.id, subscription);
    inMemorySubscriptions.set(subscription.subscription_id, subscription);
    if (subscription.razorpay_subscription_id) {
      inMemorySubscriptions.set(subscription.razorpay_subscription_id, subscription);
    }

    return subscription;
  }

  /**
   * Activates subscription upon verified payment webhook / confirmation
   */
  async activateSubscription(
    subscriptionIdentifier: string,
    paymentDetails: { payment_id: string; amount_minor: number; currency?: Currency },
  ): Promise<Subscription> {
    const sub = inMemorySubscriptions.get(subscriptionIdentifier);
    if (!sub) {
      throw new Error(`Subscription ${subscriptionIdentifier} not found.`);
    }

    sub.status = "active";
    sub.payment_id = paymentDetails.payment_id;
    sub.failure_count = 0;
    sub.updated_at = new Date().toISOString();

    // Post double entry: Consumer pays platform subscription revenue
    await financialLedgerService.recordDoubleEntry({
      source: "subscription",
      reference_id: sub.subscription_id,
      amount_minor: paymentDetails.amount_minor,
      currency: paymentDetails.currency ?? sub.currency,
      debitEntity: { id: sub.user_id, type: "consumer" },
      creditEntity: { id: "eka_subscription_revenue", type: "platform" },
      metadata: {
        subscription_id: sub.subscription_id,
        plan_id: sub.plan_id,
        payment_id: paymentDetails.payment_id,
      },
    });

    return sub;
  }

  async renewSubscription(
    subscriptionIdentifier: string,
    paymentDetails: { payment_id: string; amount_minor: number },
  ): Promise<Subscription> {
    const sub = inMemorySubscriptions.get(subscriptionIdentifier);
    if (!sub) {
      throw new Error(`Subscription ${subscriptionIdentifier} not found.`);
    }

    const plan = this.getPlanById(sub.plan_id);
    const periodDays = plan ? plan.period_days : 30;

    const currentRenewal = sub.renewal_date ? new Date(sub.renewal_date) : new Date();
    sub.renewal_date = new Date(currentRenewal.getTime() + periodDays * 86400 * 1000).toISOString();
    sub.status = "active";
    sub.payment_id = paymentDetails.payment_id;
    sub.failure_count = 0;
    sub.updated_at = new Date().toISOString();

    // Post double entry for recurring renewal
    await financialLedgerService.recordDoubleEntry({
      source: "subscription",
      reference_id: `${sub.subscription_id}_renewal_${Date.now()}`,
      amount_minor: paymentDetails.amount_minor,
      currency: sub.currency,
      debitEntity: { id: sub.user_id, type: "consumer" },
      creditEntity: { id: "eka_subscription_revenue", type: "platform" },
      metadata: {
        subscription_id: sub.subscription_id,
        renewal: true,
        payment_id: paymentDetails.payment_id,
      },
    });

    return sub;
  }

  async cancelSubscription(subscriptionIdentifier: string, cancelAtPeriodEnd = true): Promise<Subscription> {
    const sub = inMemorySubscriptions.get(subscriptionIdentifier);
    if (!sub) {
      throw new Error(`Subscription ${subscriptionIdentifier} not found.`);
    }

    if (sub.razorpay_subscription_id) {
      const provider = getPaymentProvider();
      await provider.cancelSubscription(sub.razorpay_subscription_id, cancelAtPeriodEnd);
    }

    sub.status = "cancelled";
    sub.cancelled_at = new Date().toISOString();
    sub.updated_at = new Date().toISOString();

    return sub;
  }

  async pauseSubscription(subscriptionIdentifier: string): Promise<Subscription> {
    const sub = inMemorySubscriptions.get(subscriptionIdentifier);
    if (!sub) {
      throw new Error(`Subscription ${subscriptionIdentifier} not found.`);
    }

    if (sub.razorpay_subscription_id) {
      const provider = getPaymentProvider();
      await provider.pauseSubscription(sub.razorpay_subscription_id);
    }

    sub.status = "paused";
    sub.paused_at = new Date().toISOString();
    sub.updated_at = new Date().toISOString();

    return sub;
  }

  async resumeSubscription(subscriptionIdentifier: string): Promise<Subscription> {
    const sub = inMemorySubscriptions.get(subscriptionIdentifier);
    if (!sub) {
      throw new Error(`Subscription ${subscriptionIdentifier} not found.`);
    }

    if (sub.razorpay_subscription_id) {
      const provider = getPaymentProvider();
      await provider.resumeSubscription(sub.razorpay_subscription_id);
    }

    sub.status = "active";
    sub.resumed_at = new Date().toISOString();
    sub.updated_at = new Date().toISOString();

    return sub;
  }

  async handleFailedPayment(subscriptionIdentifier: string, reason: string): Promise<Subscription> {
    const sub = inMemorySubscriptions.get(subscriptionIdentifier);
    if (!sub) {
      throw new Error(`Subscription ${subscriptionIdentifier} not found.`);
    }

    sub.failure_count += 1;
    sub.status = sub.failure_count >= 3 ? "halted" : "pending";
    sub.metadata = { ...sub.metadata, last_failure_reason: reason };
    sub.updated_at = new Date().toISOString();

    return sub;
  }

  async upgradePlan(input: UpgradePlanInput): Promise<Subscription> {
    const sub = inMemorySubscriptions.get(input.subscription_id);
    if (!sub) {
      throw new Error(`Subscription ${input.subscription_id} not found.`);
    }

    const newPlan = this.getPlanById(input.new_plan_id);
    if (!newPlan) {
      throw new Error(`Target plan ${input.new_plan_id} not found.`);
    }

    sub.plan_id = newPlan.id;
    sub.amount_minor = newPlan.amount_minor;
    sub.updated_at = new Date().toISOString();

    return sub;
  }

  getSubscriptionsByUser(userId: string): Subscription[] {
    return Array.from(inMemorySubscriptions.values()).filter((s) => s.user_id === userId);
  }

  clearInMemoryStore(): void {
    inMemorySubscriptions.clear();
  }
}

export const subscriptionsService = new SubscriptionsService();
