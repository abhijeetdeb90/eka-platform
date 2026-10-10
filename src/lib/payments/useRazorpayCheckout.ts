import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface CheckoutOptions {
  amount: number; // in paise (e.g. 29900 = ₹299.00)
  currency?: string;
  name?: string;
  description?: string;
  receipt?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: { description?: string; code?: string }) => void;
  onDismiss?: () => void;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

/**
 * Dynamically loads the Razorpay checkout.js script if not present
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Custom React Hook for Razorpay Standard Web Checkout
 */
export function useRazorpayCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCheckout = useCallback(async (options: CheckoutOptions) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Ensure Razorpay checkout.js is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        const msg = "Unable to load Razorpay payment interface. Please check your internet connection.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      // 2. Call backend /api/create-order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: options.amount,
          currency: options.currency || "INR",
          receipt: options.receipt,
          notes: options.notes,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || `Order creation failed with status ${orderRes.status}`);
      }

      const orderData = await orderRes.json();
      const orderId = orderData.order_id || orderData.id;

      if (!orderId) {
        throw new Error("No order_id received from server.");
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay Client Key (VITE_RAZORPAY_KEY_ID) is not configured in environment.");
      }

      // 3. Configure Razorpay Standard Checkout modal
      const rzpOptions = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: options.name || "EKA Cultural Sanctuary",
        description: options.description || "Cultural Membership & Intelligence",
        image: "/brand/eka-mark.svg",
        order_id: orderId,
        prefill: {
          name: options.prefill?.name || "",
          email: options.prefill?.email || "",
          contact: options.prefill?.contact || "",
        },
        theme: {
          color: "#8C4A32", // EKA Terracotta Brand Accent
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            if (options.onDismiss) {
              options.onDismiss();
            } else {
              toast.info("Payment cancelled. You can retry whenever you're ready.");
            }
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Verify payment signature on backend
            toast.loading("Verifying payment authenticity...");
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json().catch(() => ({}));

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            toast.dismiss();
            toast.success("Payment successful! Access granted.");

            if (options.onSuccess) {
              options.onSuccess(response);
            }
          } catch (verificationError: any) {
            toast.dismiss();
            const msg = verificationError.message || "Cryptographic payment verification failed.";
            setError(msg);
            toast.error(msg);
            if (options.onFailure) {
              options.onFailure({ description: msg });
            }
          } finally {
            setLoading(false);
          }
        },
      };

      const rzpInstance = new window.Razorpay(rzpOptions);

      // Handle failed payment event
      rzpInstance.on("payment.failed", (failedResponse: any) => {
        setLoading(false);
        const failureMsg =
          failedResponse.error?.description ||
          failedResponse.error?.reason ||
          "Payment processing failed.";
        setError(failureMsg);
        toast.error(`Payment Failed: ${failureMsg}`);
        if (options.onFailure) {
          options.onFailure(failedResponse.error || { description: failureMsg });
        }
      });

      rzpInstance.open();
    } catch (err: any) {
      setLoading(false);
      const errMsg = err.message || "Failed to initiate payment checkout.";
      setError(errMsg);
      toast.error(errMsg);
      if (options.onFailure) {
        options.onFailure({ description: errMsg });
      }
    }
  }, []);

  return {
    openCheckout,
    loading,
    error,
  };
}
