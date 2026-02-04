"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MiniGlobe from "../components/MiniGlobe";
import OptionCard from "../components/OptionCard";
import { useI18n } from "../hooks/useI18n";
import type { FormState } from "./orderTypes";
import { INITIAL_STATE, getStepTitles } from "./orderConstants";
import {
  getBackendOptions,
  getDesignPlans,
  getSubscriptionPlans,
} from "./orderOptions";
import {
  computeEstimates,
  getBackendLockReason,
  normalizeForm,
} from "./orderUtils";

export default function SubscriptionPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const isPolish = locale === "pl";
  const EURO_TO_PLN = 4.3;
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [domainStatus, setDomainStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid" | "error"
  >("idle");
  const [domainPrice, setDomainPrice] = useState<number | null>(null);
  const studioServerUrl = process.env.NEXT_PUBLIC_STUDIO_SERVER_URL ?? "";

  const formatPrice = (price: string) => {
    if (!isPolish || !price.includes("€")) return price;
    const match = price.match(/([0-9]+(?:[.,][0-9]+)?)/);
    if (!match || match.index === undefined) return price;
    const value = Number(match[1].replace(",", "."));
    if (Number.isNaN(value)) return price;
    const pln = Math.round(value * EURO_TO_PLN);
    let suffix = price.slice(match.index + match[1].length);
    suffix = suffix.replace(/€/g, "").trim();
    suffix = suffix.replace(/\/\s*(month|mo)/gi, "/m");
    suffix = suffix.replace(/\/\s*miesiąc/gi, "/m");
    const suffixOut = suffix ? ` ${suffix}` : "";
    return `${pln} zł${suffixOut}`;
  };

  useEffect(() => {
    document.title = isPolish ? "Zamów stronę" : "Get a Website";
  }, [isPolish]);

  const designPlans = useMemo(() => getDesignPlans(isPolish), [isPolish]);

  const subscriptionPlans = useMemo(
    () => getSubscriptionPlans(isPolish),
    [isPolish],
  );

  const backendOptions = useMemo(() => getBackendOptions(isPolish), [isPolish]);

  const stepTitles = getStepTitles(isPolish);
  const getBackendLockReasonForOption = (optionId: string) =>
    getBackendLockReason(formData, optionId, isPolish);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return Boolean(formData.designPlan && formData.subscriptionPlan);
    }
    if (step === 1) {
      if (!formData.domainPlan || !formData.domainName.trim()) {
        return false;
      }
      if (formData.domainPlan === "need") {
        return domainStatus === "available";
      }
      return true;
    }
    if (step === 2) {
      return Boolean(formData.backendOption);
    }
    if (step === 3) {
      return true;
    }
    if (step === 4) {
      return Boolean(
        formData.email &&
        formData.displayName &&
        formData.shortBio &&
        formData.meetingDate &&
        formData.acceptTerms,
      );
    }
    return false;
  }, [domainStatus, formData, step]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleDomainCheck = async (rawDomain: string) => {
    const domain = rawDomain.trim().toLowerCase();
    if (!domain) return;
    setDomainStatus("checking");
    setDomainPrice(null);
    try {
      const response = await fetch(
        `/api/whois?domain=${encodeURIComponent(domain)}`,
      );
      const result = await response.json().catch(() => null);
      if (!response.ok || !result) {
        setDomainStatus("error");
        return;
      }
      if (result.status === "invalid") {
        setDomainStatus("invalid");
        return;
      }
      setDomainStatus(result.available ? "available" : "taken");
      if (result.available && typeof result.price === "number") {
        setDomainPrice(result.price + 5);
      }
    } catch {
      setDomainStatus("error");
    }
  };

  const stepLabel = stepTitles[step] ?? "";
  const showErrors = showValidation && step === stepTitles.length - 1;
  const isMissing = (value: string) => value.trim().length === 0;
  const missingEmail = showErrors && isMissing(formData.email);
  const missingName = showErrors && isMissing(formData.displayName);
  const missingDescription = showErrors && isMissing(formData.shortBio);
  const missingMeeting = showErrors && isMissing(formData.meetingDate);

  const { estOneTime, estMonthly } = useMemo(
    () => computeEstimates(formData),
    [formData],
  );
  const formatMoney = (value: number) =>
    Number.isInteger(value) ? String(value) : value.toFixed(2);
  const domainMonthlyAdd =
    formData.domainPlan === "need" &&
    domainStatus === "available" &&
    domainPrice !== null &&
    domainPrice < 60
      ? 4.99
      : 0;
  const estMonthlyWithDomain = estMonthly + domainMonthlyAdd;

  const isInstitutional = formData.designPlan === "institutional";
  const handleFinalSubmit = async () => {
    if (!canContinue || !formData.acceptTerms) {
      setShowValidation(true);
      return;
    }

    if (!studioServerUrl) {
      setSubmitError(
        isPolish
          ? "Brak konfiguracji serwera wysyłki."
          : "Submission server is not configured.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const orderPayload = {
      ...formData,
      locale,
      estOneTime,
      estMonthly,
    };

    try {
      const baseUrl = studioServerUrl.replace(/\/$/, "");
      const signResponse = await fetch(`${baseUrl}/auth/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: orderPayload }),
      });

      if (!signResponse.ok) {
        const errorBody = await signResponse.json().catch(() => null);
        throw new Error(errorBody?.error ?? "Signing failed.");
      }

      const signResult = await signResponse.json();
      const intakeResponse = await fetch(`${baseUrl}/order-intake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: orderPayload,
          timestamp: signResult.timestamp,
          token: signResult.token,
        }),
      });

      if (!intakeResponse.ok) {
        const errorBody = await intakeResponse.json().catch(() => null);
        throw new Error(errorBody?.error ?? "Order intake failed.");
      }

      if (isInstitutional) {
        setSubmitted(true);
        return;
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "orderPayload",
          JSON.stringify({
            email: formData.email,
            amount: estOneTime,
            monthly: estMonthly,
          }),
        );
      }

      router.push("/order/processing");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#d9d9d9] px-6 pb-28 pt-24 text-[#0a0a0a] sm:px-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="flex items-center gap-6">
          <MiniGlobe className="hidden md:flex" />
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {isPolish ? "Zamów stronę" : "Launch custom website."}
            </h1>
            <p className="text-base text-black/70">
              {isPolish
                ? "Zaprojektujemy, zaprogramujemy i uruchomimy stronę dla Ciebie. Nie musisz nic robić — po prostu podziel się pomysłem! Fajnie, prawda?"
                : "We are going to design, program and deploy custom website for you. You don't have to do anything just share your idea! Cool right?"}
            </p>
          </div>
        </header>

        <div className="flex w-full flex-col gap-10 lg:flex-row">
          <section className="flex-1 space-y-8">
            <div className="rounded-3xl border border-black/20 bg-[#f0ff5e] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.15)]">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-black/50">
                <span>
                  {isPolish ? "Krok" : "Step"} {step + 1} / {stepTitles.length}
                </span>
                <span>{stepLabel}</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-black/80 transition-all"
                  style={{
                    width: `${((step + 1) / stepTitles.length) * 100}%`,
                  }}
                />
              </div>

              {submitted ? (
                <div className="mt-8 space-y-4">
                  <h2 className="text-2xl font-semibold">
                    {isPolish ? "Dziękujemy!" : "Thank you!"}
                  </h2>
                  <p className="text-black/70">
                    {isPolish
                      ? "Wrócimy z ofertą i propozycją spotkania w ciągu 48h."
                      : "We will follow up with a proposal and meeting options within 48 hours."}
                  </p>
                </div>
              ) : (
                <form
                  className="mt-8 space-y-8"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={step}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="space-y-8"
                    >
                      {step === 0 && (
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-lg font-semibold">
                              {isPolish
                                ? "Pakiety projektowe"
                                : "Design packages"}
                            </h2>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              {designPlans.map((plan) => (
                                  <OptionCard
                                    key={plan.id}
                                    title={plan.title}
                                    price={formatPrice(plan.price)}
                                    showVat
                                    details={plan.details}
                                  isActive={formData.designPlan === plan.id}
                                  onSelect={() =>
                                    setFormData((prev) =>
                                      normalizeForm({
                                        ...prev,
                                        designPlan: plan.id,
                                      }),
                                    )
                                  }
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <h2 className="text-lg font-semibold">
                              <span className="inline-flex items-center gap-2">
                                {isPolish ? "Hosting" : "Hosting"}
                                <span className="group relative inline-flex items-center">
                                  <span
                                    className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-black/60 transition group-hover:text-black"
                                    tabIndex={0}
                                  >
                                    ?
                                  </span>
                                  <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-56 -translate-x-1/2 rounded-lg border border-black/10 bg-black/90 px-3 py-2 text-xs text-white/85 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
                                    {isPolish
                                      ? "Zajmiemy się techniczną stroną hostowania i utrzymywania Twojej strony."
                                      : "We will host and maintain your website."}
                                  </span>
                                </span>
                              </span>
                            </h2>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              {subscriptionPlans.map((plan) => {
                                const isActive =
                                  formData.subscriptionPlan === plan.id;
                                const isLocked =
                                  formData.designPlan === "minimal" &&
                                  plan.id === "ecommerce-site";
                                const lockReason = isLocked
                                  ? isPolish
                                    ? "Opcja niedostępna dla pakietu Minimal."
                                    : "Not available with the Minimal plan."
                                  : undefined;
                                return (
                                  <OptionCard
                                    key={plan.id}
                                    title={plan.title}
                                    price={formatPrice(plan.price)}
                                    showVat={false}
                                    details={plan.details}
                                    showEst={false}
                                    isActive={isActive}
                                    disabled={isLocked}
                                    lockReason={lockReason}
                                    onSelect={() =>
                                      setFormData((prev) =>
                                        normalizeForm({
                                          ...prev,
                                          subscriptionPlan: plan.id,
                                        }),
                                      )
                                    }
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="space-y-4">
                          <h2 className="text-lg font-semibold">
                            <span className="inline-flex items-center gap-2">
                              {isPolish ? "Domena" : "Custom domain"}
                              <span className="group relative inline-flex items-center">
                                <span
                                  className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-black/60 transition group-hover:text-black"
                                  tabIndex={0}
                                >
                                  ?
                                </span>
                                <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-64 -translate-x-1/2 rounded-lg border border-black/10 bg-black/90 px-3 py-2 text-xs text-white/85 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
                                  {isPolish
                                    ? "Domena to adres Twojej strony, np. twojadomena.pl. Możesz użyć własnej domeny lub wybrać nową."
                                    : "A domain is your website address, e.g. yourdomain.com. Use your own or pick a new one."}
                                </span>
                              </span>
                            </span>
                          </h2>
                          <div className="grid gap-4 md:grid-cols-2">
                            <OptionCard
                              title={
                                isPolish
                                  ? "Mam własną domenę"
                                  : "I own a domain"
                              }
                              price={isPolish ? "OK" : "OK"}
                              showEst={false}
                              isActive={formData.domainPlan === "own"}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  domainPlan: "own",
                                }));
                                setDomainStatus("idle");
                              }}
                            />
                            <OptionCard
                              title={
                                isPolish
                                  ? "Potrzebuję domeny"
                                  : "I need a domain"
                              }
                              price={formatPrice(
                                domainStatus === "available" && domainPrice
                                  ? domainPrice < 60
                                    ? `€4.99/${isPolish ? "m" : "mo"}`
                                    : `€${domainPrice.toFixed(2)}/yr`
                                  : domainStatus === "taken"
                                    ? "TAKEN"
                                    : "—",
                              )}
                              showEst={false}
                              isActive={formData.domainPlan === "need"}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  domainPlan: "need",
                                }));
                                setDomainStatus("idle");
                                setDomainPrice(null);
                              }}
                            />
                          </div>
                          {formData.domainPlan ? (
                            <div className="rounded-2xl border border-black/20 bg-[#f0ff5e] p-4">
                              <label className="flex flex-col gap-2 text-sm">
                                {isPolish ? "Nazwa domeny" : "Domain name"}
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                  <input
                                    name="domainName"
                                    type="text"
                                    value={formData.domainName}
                                    onChange={(event) => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        domainName: event.target.value,
                                      }));
                                      setDomainStatus("idle");
                                      setDomainPrice(null);
                                    }}
                                    placeholder={
                                      isPolish
                                        ? "np. twojadomena.pl"
                                        : "e.g. yourdomain.com"
                                    }
                                    className="w-full rounded-xl border border-black/20 bg-[#f0ff5e] px-3 py-2 text-sm focus:border-black/60 focus:outline-none"
                                  />
                                  {formData.domainPlan === "need" ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDomainCheck(formData.domainName)
                                      }
                                      disabled={
                                        !formData.domainName.trim() ||
                                        domainStatus === "checking"
                                      }
                                      className="rounded-full border border-black/30 px-4 py-2 text-xs text-black/70 transition hover:border-black/60 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {domainStatus === "checking"
                                        ? isPolish
                                          ? "Sprawdzam..."
                                          : "Checking..."
                                        : isPolish
                                          ? "Sprawdź dostępność"
                                          : "Check availability"}
                                    </button>
                                  ) : null}
                                </div>
                              </label>
                              {formData.domainPlan === "need" ? (
                                <p
                                  className={`mt-2 text-xs ${
                                    domainStatus === "available"
                                      ? "text-emerald-600"
                                      : domainStatus === "taken"
                                        ? "text-red-600"
                                        : "text-black/60"
                                  }`}
                                >
                                  {domainStatus === "available"
                                    ? isPolish
                                      ? "Domena jest dostępna."
                                      : "This domain is available."
                                    : domainStatus === "taken"
                                      ? isPolish
                                        ? "Domena jest zajęta."
                                        : "This domain is taken."
                                      : domainStatus === "invalid"
                                        ? isPolish
                                          ? "Nieprawidłowy format domeny."
                                          : "Invalid domain format."
                                        : domainStatus === "error"
                                          ? isPolish
                                            ? "Nie udało się sprawdzić domeny."
                                            : "Unable to check availability."
                                          : isPolish
                                            ? "Sprawdzimy dostępność domeny."
                                            : "We will verify availability."}
                                </p>
                              ) : (
                                <p className="mt-2 text-xs text-black/60">
                                  {isPolish
                                    ? "Podłączymy Twoją domenę do nowej strony."
                                    : "We will connect your domain to the new site."}
                                </p>
                              )}
                            </div>
                          ) : null}
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">
                              {isPolish ? "Zarządzanie treścią" : "Content Management"}
                            </h2>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            {backendOptions.map((option) => {
                              const isActive =
                                formData.backendOption === option.id;
                              const lockReason = getBackendLockReasonForOption(
                                option.id,
                              );
                              const isLocked = Boolean(lockReason);
                              const cmsPrice =
                                option.id === "wordpress"
                                  ? "€199"
                                  : option.id === "woocommerce"
                                    ? "€469"
                                    : option.id === "static"
                                      ? "€0"
                                      : option.id === "other"
                                        ? isPolish
                                          ? "Wycena"
                                          : "Custom quote"
                                        : "";
                              const strikePrice =
                                option.id === "wordpress" ||
                                option.id === "woocommerce";
                              return (
                                  <OptionCard
                                    key={option.id}
                                    title={option.title}
                                    price={formatPrice(cmsPrice)}
                                    strikePrice={strikePrice}
                                    details={[{ text: option.details }]}
                                  badge={
                                    option.id === "wordpress" ||
                                    option.id === "woocommerce"
                                      ? isPolish
                                        ? "Polecane"
                                        : "Recommended"
                                      : undefined
                                  }
                                  isActive={isActive}
                                  disabled={isLocked}
                                  lockReason={lockReason}
                                  onSelect={() =>
                                    setFormData((prev) =>
                                      normalizeForm({
                                        ...prev,
                                        backendOption: option.id,
                                        backendOther:
                                          option.id === "other"
                                            ? prev.backendOther
                                            : "",
                                      }),
                                    )
                                  }
                                >
                                  {option.id === "other" && isActive ? (
                                    <input
                                      type="text"
                                      value={formData.backendOther}
                                      onChange={(event) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          backendOther: event.target.value,
                                        }))
                                      }
                                      onClick={(event) =>
                                        event.stopPropagation()
                                      }
                                      placeholder={
                                        isPolish
                                          ? "Opisz preferowany CMS"
                                          : "Describe the CMS you want"
                                      }
                                      className="w-full rounded-lg border border-black/20 bg-[#f0ff5e] px-2 py-2 text-xs text-black focus:border-black/60 focus:outline-none"
                                    />
                                  ) : null}
                                </OptionCard>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-4">
                          <h2 className="text-lg font-semibold">
                            {isPolish
                              ? "Dodatkowe usługi"
                              : "Additional services"}
                          </h2>
                          <div className="grid gap-4 md:grid-cols-2">
                            <OptionCard
                              title={
                                isPolish ? "Dodatkowe strony" : "Add pages"
                              }
                              price={
                                isPolish
                                  ? formatPrice("200 € / strona")
                                  : "€200 per page"
                              }
                              showVat
                              isActive={formData.addPages}
                              onSelect={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  addPages: !prev.addPages,
                                }))
                              }
                            >
                              {formData.addPages ? (
                                <span className="inline-flex items-center gap-2 text-xs font-mono text-black/70">
                                  <span className="text-black/50">
                                    {isPolish ? "Liczba:" : "Count:"}
                                  </span>
                                  <input
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={formData.addPagesCount}
                                    onChange={(event) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        addPagesCount: Number(
                                          event.target.value || 1,
                                        ),
                                      }))
                                    }
                                    onClick={(event) => event.stopPropagation()}
                                    className="w-20 rounded-lg border border-black/20 bg-[#f0ff5e] px-2 py-1 text-xs text-black"
                                  />
                                </span>
                              ) : null}
                            </OptionCard>

                            <OptionCard
                              title={isPolish ? "Projekt logo" : "Logo design"}
                              price={isPolish ? formatPrice("500 €") : "€500"}
                              showVat
                              isActive={formData.logoDesign}
                              onSelect={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  logoDesign: !prev.logoDesign,
                                }))
                              }
                            />

                            <OptionCard
                              title={
                                isPolish
                                  ? "Projekt wizytówek"
                                  : "Business cards design"
                              }
                              price={isPolish ? formatPrice("130 €") : "€130"}
                              showVat
                              isActive={formData.businessCards}
                              onSelect={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  businessCards: !prev.businessCards,
                                }))
                              }
                            />

                            <OptionCard
                              title={
                                isPolish
                                  ? "Aplikacja mobilna iOS/Android"
                                  : "Mobile App iOS/Android"
                              }
                              price={
                                isPolish
                                  ? "Wycena"
                                  : "Custom quote"
                              }
                              isActive={formData.mobileApp}
                              onSelect={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  mobileApp: !prev.mobileApp,
                                }))
                              }
                            />

                            <OptionCard
                              title={isPolish ? "Post" : "Post"}
                              price={isPolish ? "W cenie" : "Included"}
                              isActive={formData.socialPost}
                              disabled
                              lockReason={
                                isPolish ? "W zestawie" : "Included by default"
                              }
                              onSelect={() => {}}
                            />

                            <OptionCard
                              title={isPolish ? "Inne" : "Other"}
                              price={
                                isPolish
                                  ? "Wycena"
                                  : "Custom quote"
                              }
                              isActive={formData.additionalOther}
                              onSelect={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  additionalOther: !prev.additionalOther,
                                }))
                              }
                            >
                              {formData.additionalOther ? (
                                <input
                                  type="text"
                                  value={formData.additionalOtherText}
                                  onChange={(event) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      additionalOtherText: event.target.value,
                                    }))
                                  }
                                  onClick={(event) => event.stopPropagation()}
                                  placeholder={
                                    isPolish
                                      ? "Opisz dodatkową usługę"
                                      : "Describe the extra service"
                                  }
                                  className="w-full rounded-lg border border-black/20 bg-[#f0ff5e] px-2 py-2 text-xs text-black focus:border-black/60 focus:outline-none"
                                />
                              ) : null}
                            </OptionCard>
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="flex flex-col gap-2 text-sm">
                            {isPolish ? "Email *" : "Email *"}
                            <input
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder={
                                isPolish ? "np. studio@..." : "e.g. studio@..."
                              }
                              className={`rounded-xl border bg-[#f0ff5e] px-3 py-2 text-sm focus:outline-none ${
                                missingEmail
                                  ? "border-orange-500 focus:border-orange-500"
                                  : "border-black/20 focus:border-black/60"
                              }`}
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-sm">
                            {isPolish ? "Imię i nazwisko *" : "Full name *"}
                            <input
                              name="displayName"
                              type="text"
                              required
                              value={formData.displayName}
                              onChange={handleInputChange}
                              placeholder={
                                isPolish ? "np. Anna Kowalska" : "e.g. Jane Doe"
                              }
                              className={`rounded-xl border bg-[#f0ff5e] px-3 py-2 text-sm focus:outline-none ${
                                missingName
                                  ? "border-orange-500 focus:border-orange-500"
                                  : "border-black/20 focus:border-black/60"
                              }`}
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-sm">
                            {isPolish
                              ? "Aktualna strona (URL)"
                              : "Existing website (URL)"}
                            <input
                              name="existingWebsite"
                              type="url"
                              value={formData.existingWebsite}
                              onChange={handleInputChange}
                              placeholder="https://"
                              className="rounded-xl border border-black/20 bg-[#f0ff5e] px-3 py-2 text-sm focus:border-black/60 focus:outline-none"
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-sm">
                            {isPolish
                              ? "Portfolio PDF (URL)"
                              : "Portfolio PDF (URL)"}
                            <input
                              name="portfolioPdf"
                              type="url"
                              value={formData.portfolioPdf}
                              onChange={handleInputChange}
                              placeholder="https://"
                              className="rounded-xl border border-black/20 bg-[#f0ff5e] px-3 py-2 text-sm focus:border-black/60 focus:outline-none"
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-sm sm:col-span-2">
                            {isPolish ? "Krótki opis *" : "Short description *"}
                            <textarea
                              name="shortBio"
                              value={formData.shortBio}
                              onChange={handleInputChange}
                              required
                              rows={4}
                              placeholder={
                                isPolish
                                  ? "Napisz kilka zdań o projekcie."
                                  : "Write a few lines about the project."
                              }
                              className={`rounded-xl border bg-[#f0ff5e] px-3 py-2 text-sm focus:outline-none ${
                                missingDescription
                                  ? "border-orange-500 focus:border-orange-500"
                                  : "border-black/20 focus:border-black/60"
                              }`}
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-sm sm:col-span-2">
                            {isPolish
                              ? "Przykładowe strony (linki)"
                              : "Website references (links)"}
                            <textarea
                              name="websiteExamples"
                              value={formData.websiteExamples}
                              onChange={handleInputChange}
                              rows={3}
                              placeholder={
                                isPolish
                                  ? "Podaj linki do stron, które lubisz."
                                  : "Share links to sites you like."
                              }
                              className="rounded-xl border border-black/20 bg-[#f0ff5e] px-3 py-2 text-sm focus:border-black/60 focus:outline-none"
                            />
                          </label>
                          <label className="flex flex-col gap-2 text-sm sm:col-span-2">
                            <span className="inline-flex items-center gap-2">
                              {isPolish
                                ? "Propozycja terminu spotkania *"
                                : "Preferred meeting date *"}
                              <span className="group relative inline-flex items-center">
                                <span
                                  className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-black/60 transition group-hover:text-black"
                                  tabIndex={0}
                                >
                                  ?
                                </span>
                                <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-72 -translate-x-1/2 rounded-lg border border-black/10 bg-black/90 px-3 py-2 text-xs text-white/85 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
                                  {isPolish
                                    ? "Spotkasz się z członkiem naszego zespołu, aby porozmawiać o Twoim projekcie. Bez obaw — wszyscy jesteśmy artystami."
                                    : "Meet with a human member of our team to talk about your project :) "}
                                </span>
                              </span>
                            </span>
                            <input
                              name="meetingDate"
                              type="datetime-local"
                              value={formData.meetingDate}
                              onChange={handleInputChange}
                              required
                              className={`rounded-xl border bg-[#f0ff5e] px-3 py-2 text-sm focus:outline-none ${
                                missingMeeting
                                  ? "border-orange-500 focus:border-orange-500"
                                  : "border-black/20 focus:border-black/60"
                              }`}
                            />
                          </label>
                          <label className="flex items-start gap-3 text-sm sm:col-span-2">
                            <input
                              type="checkbox"
                              required
                              checked={formData.acceptTerms}
                              onChange={(event) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  acceptTerms: event.target.checked,
                                }))
                              }
                              className={`mt-1 h-4 w-4 accent-black ${
                                showErrors && !formData.acceptTerms
                                  ? "ring-2 ring-orange-500"
                                  : ""
                              }`}
                            />
                            <span className="text-black/70">
                              {isPolish ? "Akceptuję " : "I accept the "}
                              <Link
                                href="/legal"
                                className="underline underline-offset-4"
                              >
                                {isPolish
                                  ? "Politykę prywatności i Regulamin"
                                  : "Privacy Policy and Terms"}
                              </Link>{" "}
                              *
                            </span>
                          </label>
                          <div className="text-sm text-black/70 lg:hidden">
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!canContinue || !formData.acceptTerms) {
                                    setShowValidation(true);
                                    return;
                                  }
                                  void handleFinalSubmit();
                                }}
                                aria-disabled={
                                  !canContinue || !formData.acceptTerms
                                }
                                className={`w-full rounded-full px-8 py-3 text-base font-medium text-white transition ${
                                  canContinue && formData.acceptTerms
                                    ? "bg-black hover:scale-[1.02]"
                                    : "cursor-not-allowed bg-black/40"
                                }`}
                              >
                                {isPolish ? "Płatność" : "Payment"}
                              </button>
                              <span className="text-sm text-black/50">
                                {isPolish
                                  ? "Po wysłaniu formularza rozpoczynamy rozliczenie subskrypcji za obsługę zamówienia. Fakturę za pozostałe wybrane usługi prześlemy po pierwszym spotkaniu."
                                  : "By completing this form you start the subscription billing. The design fee will be sent after the first meeting."}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                      disabled={step === 0}
                      className="rounded-full border border-black/20 px-6 py-2 text-sm text-black/70 transition hover:border-black/60 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isPolish ? "Wstecz" : "Back"}
                    </button>
                    {step < stepTitles.length - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setStep((prev) =>
                            Math.min(prev + 1, stepTitles.length - 1),
                          )
                        }
                        disabled={!canContinue}
                        className="rounded-full bg-black px-6 py-2 text-sm text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isPolish ? "Dalej" : "Next"}
                      </button>
                    ) : null}
                  </div>
                </form>
              )}
            </div>
          </section>

          <aside className="hidden w-full max-w-xl space-y-6 lg:block lg:sticky lg:top-4 lg:h-fit">
            <div className="rounded-3xl border border-black/20 bg-[#f0ff5e] p-6">
              <h3 className="text-sm font-mono uppercase text-black/50">
                {isPolish ? "Podsumowanie" : "Summary"}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-black/70">
                <div>
                  <div className="text-xs font-mono uppercase text-black/40">
                    {isPolish ? "Pakiety" : "Design packages"}
                  </div>
                  <div>
                    {formData.designPlan
                      ? designPlans.find(
                          (plan) => plan.id === formData.designPlan,
                        )?.title
                      : isPolish
                        ? "Nie wybrano"
                        : "Not selected"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-black/40">
                    {isPolish ? "Zamówienie" : "Order"}
                  </div>
                  <div>
                    {formData.subscriptionPlan
                      ? subscriptionPlans.find(
                          (plan) => plan.id === formData.subscriptionPlan,
                        )?.title
                      : isPolish
                        ? "Nie wybrano"
                        : "Not selected"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-black/40">
                    {isPolish ? "CMS" : "CMS"}
                  </div>
                  <div>
                    {formData.backendOption
                      ? backendOptions.find(
                          (option) => option.id === formData.backendOption,
                        )?.title
                      : isPolish
                        ? "Nie wybrano"
                        : "Not selected"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-black/40">
                    {isPolish ? "Domena" : "Domain"}
                  </div>
                  <div>
                    {!formData.domainPlan
                      ? isPolish
                        ? "Nie wybrano"
                        : "Not selected"
                      : formData.domainPlan === "own"
                        ? formData.domainName || "—"
                        : formData.domainName || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-black/40">
                    {isPolish ? "Kontakt" : "Contact"}
                  </div>
                  <div>
                    {formData.displayName || "—"} · {formData.email || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-black/40">
                    {isPolish ? "Dodatki" : "Add-ons"}
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    {[
                      formData.addPages
                        ? {
                            key: "pages",
                            label: `${isPolish ? "Strony" : "Pages"} × ${
                              formData.addPagesCount
                            }`,
                          }
                        : null,
                      formData.businessCards
                        ? {
                            key: "cards",
                            label: isPolish ? "Wizytówki" : "Business cards",
                          }
                        : null,
                      formData.logoDesign
                        ? {
                            key: "logo",
                            label: isPolish ? "Logo" : "Logo design",
                          }
                        : null,
                      formData.mobileApp
                        ? {
                            key: "mobile",
                            label: isPolish
                              ? "Aplikacja mobilna"
                              : "Mobile app",
                          }
                        : null,
                      formData.socialPost
                        ? {
                            key: "social",
                            label: isPolish ? "Post" : "Post",
                            tooltip: isPolish
                              ? "Dokumentacja finalnych rezultatów zostanie udostępniona na naszej Stronie/Instagramie za darmo i przekazana klientowi."
                              : "Documentation of the final results will be shared on our website/Instagram for free and provided to the client.",
                          }
                        : null,
                      formData.additionalOther
                        ? {
                            key: "other",
                            label:
                              formData.additionalOtherText ||
                              (isPolish ? "Inne" : "Other"),
                          }
                        : null,
                    ]
                      .filter(Boolean)
                      .map(
                        (item, index, arr) =>
                          item && (
                            <span
                              key={item.key}
                              className="inline-flex items-center"
                            >
                              {item.key === "social" ? (
                                <span className="group relative inline-flex items-center gap-1">
                                  <span>{item.label}</span>
                                  <span
                                    className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-black/60 transition group-hover:text-black"
                                    tabIndex={0}
                                  >
                                    ?
                                  </span>
                                  <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-64 -translate-x-1/2 rounded-lg border border-black/10 bg-black/90 px-3 py-2 text-xs text-white/85 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
                                    {item.tooltip}
                                  </span>
                                </span>
                              ) : (
                                <span>{item.label}</span>
                              )}
                              {index < arr.length - 1 ? (
                                <span>,&nbsp;</span>
                              ) : null}
                            </span>
                          ),
                      ) || (isPolish ? "Brak" : "None")}
                  </div>
                </div>
                {!isInstitutional ? (
                  <div>
                    <div className="text-xs font-mono uppercase text-black/40">
                      {isPolish ? "Cena" : "Price"}
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <span className="font-mono text-black/70">
                        {isPolish ? "est." : "est."}{" "}
                        {estOneTime === 0 && estMonthlyWithDomain === 0
                          ? "—"
                          : (() => {
                              const oneTime =
                                estOneTime > 0
                                  ? isPolish
                                    ? `${Math.round(estOneTime * EURO_TO_PLN)} zł`
                                    : `€${estOneTime}`
                                  : "";
                              const monthly =
                                estMonthlyWithDomain > 0
                                  ? isPolish
                                    ? `${Math.round(estMonthlyWithDomain * EURO_TO_PLN)} zł/m`
                                    : `€${formatMoney(estMonthlyWithDomain)}/mo`
                                  : "";
                              if (oneTime && monthly) {
                                return `${oneTime} + vat + ${monthly}`;
                              }
                              if (oneTime) {
                                return `${oneTime} + vat`;
                              }
                              if (monthly) {
                                return `${monthly} + vat`;
                              }
                              return "—";
                            })()}
                      </span>
                      <span className="group relative inline-flex items-center">
                        <span
                          className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-black/60 transition group-hover:text-black"
                          tabIndex={0}
                        >
                          ?
                        </span>
                        <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-64 -translate-x-1/2 rounded-lg border border-black/10 bg-black/90 px-3 py-2 text-xs text-white/85 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
                          {isPolish
                            ? "Projekty są wyceniane indywidualnie i cena może się nieznacznie zmienić. Przed pierwszym spotkaniem konieczne jest opłacenie subskrypcji za obsługę zlecenia."
                            : "Projects are priced individually and the price may change slightly. You will be asked to pay for the design after the first meeting."}
                        </span>
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="rounded-3xl border border-black/20 bg-[#f0ff5e] p-6 text-sm text-black/70">
              <h4 className="text-base font-semibold text-black">
                {isPolish ? "Co dalej?" : "What happens next?"}
              </h4>
              <div className="mt-3 space-y-2">
                <p>
                  {isPolish
                    ? "W ciągu 24h otrzymasz od Nas email zwrotny, w którym doprecyzujemy szczegóły projektu. Po pierwszym spotkaniu i twojej akceptacji ruszymy z projektem."
                    : "Within 24 hours you will receive a reply email where we will clarify the project schedule. After the first meeting and your approval, we will start the project and send an invoice for the selected services."}
                </p>
                <p>
                  {isPolish
                    ? "Masz pytania? Skorzystaj z zakładki"
                    : "If you have any questions, please use the"}{" "}
                  <Link
                    href="/contact"
                    className="underline underline-offset-4"
                  >
                    {isPolish ? "Kontakt" : "Contact page"}
                  </Link>
                </p>
              </div>
            </div>
            {step === stepTitles.length - 1 ? (
              <div className="text-sm text-black/70">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    aria-disabled={
                      !canContinue || !formData.acceptTerms || isSubmitting
                    }
                    className={`w-full rounded-full px-8 py-3 text-base font-medium text-white transition ${
                      canContinue && formData.acceptTerms && !isSubmitting
                        ? "bg-black hover:scale-[1.02]"
                        : "cursor-not-allowed bg-black/40"
                    }`}
                  >
                    {isSubmitting
                      ? isPolish
                        ? "Wysyłanie..."
                        : "Submitting..."
                      : isInstitutional
                        ? isPolish
                          ? "Wyślij"
                          : "Submit"
                        : isPolish
                          ? "Płatność"
                          : "Payment"}
                  </button>
                  {submitError ? (
                    <span className="text-sm text-red-600">{submitError}</span>
                  ) : null}
                  <span className="text-sm text-black/50">
                    {isPolish
                      ? "Po wysłaniu formularza rozpoczynamy rozliczenie subskrypcji za obsługę zamówienia. Fakturę za pozostałe wybrane usługi prześlemy po pierwszym spotkaniu."
                      : "By completing this form you start the subscription billing. The design fee will be sent after the first meeting."}
                  </span>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
