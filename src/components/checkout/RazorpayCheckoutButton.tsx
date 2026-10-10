import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useRazorpayCheckout, type CheckoutOptions } from "@/lib/payments/useRazorpayCheckout";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RazorpayCheckoutButtonProps extends Omit<ButtonProps, "onClick"> {
  amount: number; // in paise (e.g. 29900 for ₹299.00)
  currency?: string;
  planName?: string;
  description?: string;
  receipt?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess?: CheckoutOptions["onSuccess"];
  onFailure?: CheckoutOptions["onFailure"];
  onDismiss?: CheckoutOptions["onDismiss"];
  label?: string;
  showIcon?: boolean;
}

/**
 * RazorpayCheckoutButton
 * 
 * Reusable checkout button that integrates seamlessly with EKA's
 * Razorpay Standard Web Checkout backend flow:
 * 1. Creates order on server (/api/create-order)
 * 2. Launches Razorpay Standard Checkout modal
 * 3. Cryptographically verifies HMAC-SHA256 signature on server (/api/verify-payment)
 */
export function RazorpayCheckoutButton({
  amount,
  currency = "INR",
  planName = "EKA Cultural Sanctuary",
  description = "Cultural Membership & Contextual Intelligence",
  receipt,
  prefill,
  notes,
  onSuccess,
  onFailure,
  onDismiss,
  label,
  showIcon = true,
  disabled,
  className,
  children,
  variant = "default",
  size = "default",
  ...buttonProps
}: RazorpayCheckoutButtonProps) {
  const { openCheckout, loading } = useRazorpayCheckout();

  const handleCheckout = () => {
    openCheckout({
      amount,
      currency,
      name: planName,
      description,
      receipt,
      prefill,
      notes: {
        platform: "EKA",
        ...notes,
      },
      onSuccess,
      onFailure,
      onDismiss,
    });
  };

  const formattedPrice =
    currency === "INR"
      ? `₹${(amount / 100).toLocaleString("en-IN")}`
      : `${currency} ${(amount / 100).toFixed(2)}`;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCheckout}
      disabled={disabled || loading}
      className={cn("relative font-medium transition-all", className)}
      {...buttonProps}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin mr-2" />
          <span>Opening Checkout...</span>
        </>
      ) : children ? (
        children
      ) : (
        <>
          {showIcon && <CreditCard className="size-4 mr-2 opacity-90" />}
          <span>{label || `Pay ${formattedPrice}`}</span>
        </>
      )}
    </Button>
  );
}
