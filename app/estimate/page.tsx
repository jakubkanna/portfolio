"use client";

import { useEffect } from "react";
import { useI18n } from "../hooks/useI18n";

const EN_FORM_URL = "https://tally.so/r/EkWdAq?transparentBackground=1";
const PL_FORM_URL = "https://tally.so/r/0QOByP?transparentBackground=1";

export default function EstimatePage() {
  const { locale } = useI18n();
  const isPolish = locale === "pl";
  const title = isPolish ? "Poproś o wycenę" : "Get an estimate";
  const formUrl = isPolish ? PL_FORM_URL : EN_FORM_URL;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <main className="fixed inset-0 bg-white">
      <iframe
        src={formUrl}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        aria-label={title}
      />
    </main>
  );
}
