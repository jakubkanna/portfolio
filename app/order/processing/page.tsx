"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import NoticeCard from "../../components/NoticeCard";

export default function OrderProcessingPage() {
  const router = useRouter();
  const checkoutUrl = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL ?? "";

  const payload = useMemo(() => {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem("orderPayload");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as {
        email?: string;
        amount?: number;
        monthly?: number;
      };
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!payload) {
      router.replace("/order/fail");
      return;
    }
    if (!checkoutUrl) {
      router.replace("/order/fail");
      return;
    }

    const startCheckout = async () => {
      try {
        const width = 480;
        const height = 680;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(
          checkoutUrl,
          "stripe-checkout",
          `width=${width},height=${height},left=${left},top=${top}`,
        );

        if (!popup) {
          window.location.href = checkoutUrl;
          return;
        }
      } catch {
        router.replace("/order/fail");
      }
    };

    void startCheckout();
  }, [checkoutUrl, payload, router]);

  return (
    <main className="min-h-screen bg-[#d9d9d9] px-6 pb-28 pt-24 text-[#0a0a0a] sm:px-12">
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
        <NoticeCard
          title="Processing your payment"
          actions={
            <button
              type="button"
              onClick={() => router.replace("/")}
              className="rounded-full border border-black/30 px-4 py-2 text-xs text-black/70"
            >
              Back to home page
            </button>
          }
        >
          <p>Check your email for details.</p>
        </NoticeCard>
      </div>
    </main>
  );
}
