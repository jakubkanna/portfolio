"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GoogleAnalytics from "./GoogleAnalytics";
import { useI18n } from "../hooks/useI18n";

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
  const { locale } = useI18n();
  const [consent, setConsent] = useState<ConsentState>(() => {
    if (typeof window === "undefined") return "loading";
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "accepted" || stored === "rejected" ? stored : "unknown";
  });

  useEffect(() => {
    if (consent !== "accepted") return;
    initGa(gaId);
  }, [consent, gaId]);

  const canTrack = useMemo(() => consent === "accepted", [consent]);
  const showBanner = useMemo(() => consent === "unknown", [consent]);
  const copy = useMemo(
    () =>
      locale === "pl"
        ? {
            message:
              "Jeśli wyrazisz zgodę, użyjemy analitycznych plików cookies, aby lepiej zrozumieć ruch na stronie.",
            detailsPrefix: "Więcej informacji znajdziesz w ",
            detailsLink: "polityce prywatności",
            accept: "Akceptuję",
            reject: "Odrzucam",
          }
        : {
            message:
              "If you agree, we will use analytical cookies to better understand website traffic.",
            detailsPrefix: "You can find more details in the ",
            detailsLink: "privacy policy",
            accept: "Accept",
            reject: "Reject",
          },
    [locale],
  );

  return (
    <>
      {canTrack ? <GoogleAnalytics gaId={gaId} /> : null}

      {showBanner ? (
        <aside className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-black/15 bg-[#e6e6e6] p-4 text-xs text-black/80 shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:bottom-20 sm:left-auto sm:right-6 sm:w-auto sm:translate-x-0">
          <p>{copy.message}</p>
          <p className="mt-2">
            {copy.detailsPrefix}
            <Link href="/legal" className="underline underline-offset-2">
              {copy.detailsLink}
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
              {copy.accept}
            </button>
            <button
              type="button"
              onClick={() => {
                window.localStorage.setItem(CONSENT_KEY, "rejected");
                setConsent("rejected");
              }}
              className="rounded-full border border-black/30 px-3 py-1.5 text-[11px] text-black/80"
            >
              {copy.reject}
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
