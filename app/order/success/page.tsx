"use client";

import { useEffect, useState } from "react";
import NoticeCard from "../../components/NoticeCard";

export default function OrderSuccessPage() {
  const [paymentId] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem("paymentId") ?? "";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (paymentId) {
      window.sessionStorage.removeItem("paymentId");
    }
  }, [paymentId]);

  return (
    <main className="min-h-screen bg-[#d9d9d9] px-6 pb-28 pt-24 text-[#0a0a0a] sm:px-12">
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
        <NoticeCard title="Payment successful">
          <p>
            Thanks! We received your payment and will reach out with next steps.
          </p>
          {paymentId ? (
            <p className="mt-3 text-xs text-black/60">
              Payment ID: <span className="font-mono">{paymentId}</span>
            </p>
          ) : null}
        </NoticeCard>
      </div>
    </main>
  );
}
