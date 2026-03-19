"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GoogleAnalytics from "./GoogleAnalytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type ConsentState = "accepted" | "rejected" | "unknown" | "loading";

type GaCookieConsentProps = {
  gaId: string;
};

const CONSENT_KEY = "cookie-consent-ga";

const initGa = (gaId: string) => {
  if (typeof window === "undefined" || !gaId) return;
  if (document.getElementById("ga-script-loader")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", gaId, { send_page_view: false });

  const script = document.createElement("script");
  script.id = "ga-script-loader";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);
};

export default function GaCookieConsent({ gaId }: GaCookieConsentProps) {
  const [consent, setConsent] = useState<ConsentState>("loading");

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
      return;
    }
    setConsent("unknown");
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;
    initGa(gaId);
  }, [consent, gaId]);

  const canTrack = useMemo(() => consent === "accepted", [consent]);
  const showBanner = useMemo(() => consent === "unknown", [consent]);

  return (
    <>
      {canTrack ? <GoogleAnalytics gaId={gaId} /> : null}

      {showBanner ? (
        <aside className="fixed bottom-20 right-4 z-50 max-w-sm rounded-2xl border border-black/15 bg-[#e6e6e6] p-4 text-xs text-black/80 shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:right-6">
          <p>
            Używamy plików cookies analitycznych (Google Analytics), aby mierzyć
            kliknięcia i ruch na stronie.
          </p>
          <p className="mt-2">
            Szczegóły znajdziesz w{" "}
            <Link href="/legal" className="underline underline-offset-2">
              polityce prywatności
            </Link>
            .
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                window.localStorage.setItem(CONSENT_KEY, "accepted");
                setConsent("accepted");
              }}
              className="rounded-full bg-black px-3 py-1.5 text-[11px] text-white"
            >
              Akceptuję
            </button>
            <button
              type="button"
              onClick={() => {
                window.localStorage.setItem(CONSENT_KEY, "rejected");
                setConsent("rejected");
              }}
              className="rounded-full border border-black/30 px-3 py-1.5 text-[11px] text-black/80"
            >
              Odrzucam
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
