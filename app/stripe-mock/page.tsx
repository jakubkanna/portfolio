"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function StripeMockPage() {
  const params = useSearchParams();
  const sessionId = useMemo(() => params.get("session") ?? "", [params]);

  const sendResult = (type: "stripe:success" | "stripe:cancel") => {
    if (window.opener) {
      window.opener.postMessage({ type, sessionId }, window.location.origin);
    }
    window.close();
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <h1 className="text-2xl font-semibold">Mock Stripe Checkout</h1>
          <p className="mt-2 text-sm text-white/70">
            Session: <span className="font-mono">{sessionId || "unknown"}</span>
          </p>
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => sendResult("stripe:success")}
              className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-black"
            >
              Pay &amp; Complete
            </button>
            <button
              type="button"
              onClick={() => sendResult("stripe:cancel")}
              className="w-full rounded-full border border-white/30 px-4 py-3 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
