"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type GoogleAnalyticsProps = {
  gaId: string;
};

const getClickLabel = (element: HTMLElement) => {
  const dataLabel = element.dataset.trackClick;
  if (dataLabel) return dataLabel.trim().slice(0, 200);

  const aria = element.getAttribute("aria-label");
  if (aria) return aria.trim().slice(0, 200);

  const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 200);

  return element.tagName.toLowerCase();
};

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag || !pathname) return;
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      send_to: gaId,
    });
  }, [gaId, pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || !window.gtag) return;

      const clickable = target.closest(
        "a,button,[role='button'],[data-track-click]",
      ) as HTMLElement | null;

      if (!clickable) return;

      const href =
        clickable instanceof HTMLAnchorElement
          ? clickable.getAttribute("href") ?? ""
          : "";

      window.gtag("event", "ui_click", {
        event_category: "engagement",
        event_label: getClickLabel(clickable),
        link_url: href,
        element_tag: clickable.tagName.toLowerCase(),
        page_path: window.location.pathname,
        send_to: gaId,
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, [gaId]);

  return null;
}
