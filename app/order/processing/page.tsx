"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import NoticeCard from "../../components/NoticeCard";

export default function OrderProcessingPage() {
  const router = useRouter();
  const studioServerUrl = process.env.NEXT_PUBLIC_STUDIO_SERVER_URL ?? "";

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
    if (!studioServerUrl) {
      router.replace("/order/fail");
      return;
    }

    const baseUrl = studioServerUrl.replace(/\/$/, "");

    const startCheckout = async () => {
      try {
        const stripeResponse = await fetch(`${baseUrl}/stripe/mock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: payload.email,
            amount: payload.amount,
            monthly: payload.monthly,
          }),
        });

        if (!stripeResponse.ok) {
          const errorBody = await stripeResponse.json().catch(() => null);
          throw new Error(errorBody?.error ?? "Stripe mock failed.");
        }

        const stripeResult = await stripeResponse.json();
        const popupUrl = `/stripe-mock?session=${encodeURIComponent(
          stripeResult.sessionId,
        )}`;
        const width = 480;
        const height = 680;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(
          popupUrl,
          "stripe-mock",
          `width=${width},height=${height},left=${left},top=${top}`,
        );

        if (!popup) {
          throw new Error("Payment window blocked. Please allow popups.");
        }

        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          if (event.data?.type === "stripe:success") {
            if (stripeResult.paymentId) {
              window.sessionStorage.setItem(
                "paymentId",
                String(stripeResult.paymentId),
              );
            }
            window.sessionStorage.removeItem("orderPayload");
            window.removeEventListener("message", handleMessage);
            router.replace("/order/success");
          }
          if (event.data?.type === "stripe:cancel") {
            window.removeEventListener("message", handleMessage);
            router.replace("/order/fail");
          }
        };

        window.addEventListener("message", handleMessage);
      } catch {
        router.replace("/order/fail");
      }
    };

    void startCheckout();
  }, [payload, router, studioServerUrl]);

  return (
    <main className="min-h-screen bg-[#d9d9d9] px-6 pb-28 pt-24 text-[#0a0a0a] sm:px-12">
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
        <NoticeCard
          title="Processing your payment"
          actions={
            <button
              type="button"
              onClick={() => router.replace("/order")}
              className="rounded-full border border-black/30 px-4 py-2 text-xs text-black/70"
            >
              Back to form
            </button>
          }
        >
          <p>Please complete the payment in the popup window.</p>
        </NoticeCard>
      </div>
    </main>
  );
}
