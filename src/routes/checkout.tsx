import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { RazorpayCheckoutButton } from "@/components/checkout/RazorpayCheckoutButton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  CreditCard,
  Building2,
  ArrowLeft,
  Receipt,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "EKA Secure Checkout — Razorpay Payment Gateway" },
      {
        name: "description",
        content:
          "Complete your EKA membership subscription or creator offering with secure Razorpay Standard Web Checkout.",
      },
    ],
  }),
  component: CheckoutPage,
});

interface PlanOption {
  id: string;
  name: string;
  tagline: string;
  amountPaise: number;
  period: string;
  description: string;
  popular?: boolean;
}

const CHECKOUT_PLANS: PlanOption[] = [
  {
    id: "test-micro",
    name: "Razorpay Test Micro-Payment",
    tagline: "Instant Gateway Verification",
    amountPaise: 500, // ₹5.00
    period: "one-time test",
    description: "Fast ₹5 verification transaction using Razorpay Test mode credentials.",
  },
  {
    id: "eka-plus-monthly",
    name: "EKA+ Intelligence Monthly",
    tagline: "Contextual AI & Cross-Cultural Inquiry",
    amountPaise: 29900, // ₹299.00
    period: "month",
    description: "Full access to Ask EKA AI, cultural comparisons, and deep manuscript sources.",
    popular: true,
  },
  {
    id: "creator-studio-monthly",
    name: "Creator Studio Professional",
    tagline: "Creation Workspace & Direct Monetization",
    amountPaise: 79900, // ₹799.00
    period: "month",
    description: "Publish paid offerings, real-time analytics, and settlement ledger.",
  },
  {
    id: "eka-annual-patron",
    name: "EKA Patron Annual",
    tagline: "Full Sanctuary Access + 2 Months Free",
    amountPaise: 299000, // ₹2,990.00
    period: "year",
    description: "Annual cultural intelligence membership with priority features and archive passes.",
  },
];

function CheckoutPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("eka-plus-monthly");
  const [customerName, setCustomerName] = useState("Aditi Rao");
  const [customerEmail, setCustomerEmail] = useState("aditi.rao@example.com");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [paymentResult, setPaymentResult] = useState<{
    orderId: string;
    paymentId: string;
    signature: string;
  } | null>(null);

  const currentPlan: PlanOption =
    CHECKOUT_PLANS.find((p) => p.id === selectedPlanId) || (CHECKOUT_PLANS[1] as PlanOption);

  const inrTotal = (currentPlan.amountPaise / 100).toFixed(2);
  const baseAmount = ((currentPlan.amountPaise / 1.18) / 100).toFixed(2);
  const gstAmount = (Number(inrTotal) - Number(baseAmount)).toFixed(2);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <SiteHeader />

      <main className="flex-1 container-eka mx-auto max-w-5xl px-4 py-12 lg:py-16">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to Membership Plans
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-border/60 pb-8 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-primary">
                <ShieldCheck className="size-3.5" />
                <span>Razorpay Standard Web Checkout</span>
              </div>
              <h1 className="mt-3 font-serif text-3xl sm:text-4xl">
                EKA Secure Payment
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Cryptographically secured order creation and payment signature verification.
                Supports Cards, UPI, Netbanking, and Wallets.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-border/80 px-3 py-1 font-mono text-xs">
                <Lock className="size-3 mr-1 text-emerald-600" />
                HMAC-SHA256
              </Badge>
              <Badge variant="outline" className="border-border/80 px-3 py-1 font-mono text-xs">
                Test Mode
              </Badge>
            </div>
          </div>
        </div>

        {paymentResult ? (
          /* Payment Success Confirmation Card */
          <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/40 bg-emerald-500/5 p-8 shadow-calm text-center space-y-6">
            <div className="size-16 rounded-full bg-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 font-bold">
                Transaction Authenticity Verified
              </span>
              <h2 className="font-serif text-3xl mt-1">Payment Successful!</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Your payment was captured and cryptographically verified against the Razorpay API.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-semibold text-foreground">{paymentResult.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Payment ID:</span>
                <span className="font-semibold text-foreground">{paymentResult.paymentId}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Verification Algorithm:</span>
                <span className="text-emerald-600 font-semibold">HMAC-SHA256 (Timing-Safe)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Signature Digest:</span>
                <span className="truncate max-w-[280px] text-muted-foreground">
                  {paymentResult.signature}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => setPaymentResult(null)}
                className="px-6 py-2.5 rounded-full border border-border text-sm hover:bg-accent transition-colors"
              >
                Make Another Payment
              </button>
              <Link
                to="/discover"
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                <span>Continue to EKA Sanctuary</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left Column: Plan Selection & Customer Prefill */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Plan Selector */}
              <div>
                <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-3">
                  1. Select Membership or Service
                </Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {CHECKOUT_PLANS.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const priceFormatted = (plan.amountPaise / 100).toLocaleString("en-IN");
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all relative ${
                          isSelected
                            ? "border-primary bg-primary/[0.04] shadow-sm ring-1 ring-primary"
                            : "border-border/80 bg-card hover:border-primary/40"
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute top-3 right-3 text-[10px] font-mono uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                        <div className="font-serif text-base font-semibold text-foreground">
                          {plan.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {plan.tagline}
                        </div>
                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="font-display text-2xl font-bold text-foreground">
                            ₹{priceFormatted}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            /{plan.period}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Customer Details */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4">
                <div>
                  <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                    2. Payer Information (Prefill)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    These details will prefill the Razorpay checkout modal for seamless payment.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-xs">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs">
                      Mobile Number
                    </Label>
                    <Input
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Trust & Guarantee Box */}
              <div className="rounded-2xl border border-border/60 bg-sand/15 p-4 flex items-start gap-3 text-xs text-muted-foreground">
                <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground font-medium">
                    RBI & PCI-DSS Level 1 Compliant:
                  </strong>{" "}
                  Your sensitive payment information is processed directly by Razorpay without
                  ever passing through or being stored on EKA application servers.
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout Button */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 rounded-3xl border-2 border-border/80 bg-card p-6 sm:p-8 shadow-calm space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Order Summary
                  </span>
                  <h3 className="font-serif text-2xl font-normal mt-1">{currentPlan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentPlan.description}
                  </p>
                </div>

                <div className="border-t border-b border-border/60 py-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Amount</span>
                    <span className="font-mono">₹{baseAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>GST (18% inclusive)</span>
                    <span className="font-mono">₹{gstAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Processing & Platform Fee</span>
                    <span className="font-mono text-emerald-600">₹0.00 (Waived)</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-border/60">
                    <span className="font-semibold text-foreground text-base">Total Payable</span>
                    <div className="text-right">
                      <span className="font-display text-2xl font-bold text-primary">
                        ₹{inrTotal}
                      </span>
                      <span className="block text-[10px] font-mono text-muted-foreground">
                        ({currentPlan.amountPaise} paise)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <RazorpayCheckoutButton
                    amount={currentPlan.amountPaise}
                    currency="INR"
                    planName={currentPlan.name}
                    description={`EKA - ${currentPlan.tagline}`}
                    prefill={{
                      name: customerName,
                      email: customerEmail,
                      contact: customerPhone,
                    }}
                    notes={{
                      plan_id: currentPlan.id,
                      user_email: customerEmail,
                    }}
                    onSuccess={(res) => {
                      setPaymentResult({
                        orderId: res.razorpay_order_id,
                        paymentId: res.razorpay_payment_id,
                        signature: res.razorpay_signature,
                      });
                    }}
                    className="w-full h-12 rounded-full text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lift"
                    label={`Pay ₹${inrTotal} with Razorpay`}
                  />

                  <div className="text-center text-[11px] text-muted-foreground space-y-1">
                    <p className="flex items-center justify-center gap-1">
                      <Lock className="size-3 text-emerald-600" />
                      256-bit encrypted checkout via Razorpay Gateway
                    </p>
                    <p>Includes credit/debit cards, UPI, Google Pay, PhonePe & Netbanking.</p>
                  </div>
                </div>

                {/* Feature highlights */}
                <div className="rounded-2xl bg-sand/20 p-4 border border-border/60 space-y-2 text-xs">
                  <div className="font-medium text-foreground">Included with your access:</div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="size-3.5 text-emerald-600" />
                    <span>Instant activation upon signature verification</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="size-3.5 text-emerald-600" />
                    <span>Official tax invoice & digital receipt</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="size-3.5 text-emerald-600" />
                    <span>Direct contribution to cultural custodians</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
