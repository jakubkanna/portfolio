"use client";

import { useMemo, useState } from "react";
import en from "../locales/en.json";
import pl from "../locales/pl.json";

const translations = { en, pl };
type Translations = typeof translations;
type Locale = keyof Translations;
type Translation = Translations[Locale];

const DEFAULT_LOCALE: Locale = "en";

const normalizeLocale = (value?: string) => value?.toLowerCase().split("-")[0] ?? "";

function resolveLocale(preferred?: readonly string[]): Locale {
  if (preferred) {
    for (const entry of preferred) {
      const normalized = normalizeLocale(entry);
      if (normalized === "pl") return "pl";
      if (normalized === "en") return "en";
    }
  }
  return DEFAULT_LOCALE;
}

function getInitialLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const candidates: string[] = [];
  if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages);
  if (navigator.language) candidates.push(navigator.language);
  return resolveLocale(candidates);
}

export function useI18n() {
  const [locale] = useState<Locale>(() => getInitialLocale());

  const t = useMemo<Translation>(
    () => translations[locale] ?? translations[DEFAULT_LOCALE],
    [locale]
  );

  return { locale, t };
}
