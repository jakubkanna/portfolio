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
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const studioServerUrl = process.env.NEXT_PUBLIC_STUDIO_SERVER_URL ?? "";

  useEffect(() => {
    document.title = isPolish ? "Zamów stronę" : "Get a Website";
  }, [isPolish]);

  const designPlans = useMemo(() => getDesignPlans(isPolish), [isPolish]);

  const subscriptionPlans = useMemo(
    () => getSubscriptionPlans(isPolish),
    [isPolish],
  );

  const backendOptions = useMemo(
    () => getBackendOptions(isPolish),
    [isPolish],
  );

  const stepTitles = getStepTitles(isPolish);
  const getBackendLockReasonForOption = (optionId: string) =>
    getBackendLockReason(formData, optionId, isPolish);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return Boolean(formData.designPlan && formData.subscriptionPlan);
    }
    if (step === 1) {
      return Boolean(formData.backendOption);
    }
    if (step === 2) {
      return true;
    }
    if (step === 3) {
      return Boolean(
        formData.email &&
        formData.displayName &&
        formData.shortBio &&
        formData.meetingDate &&
        formData.acceptTerms,
      );
    }
    return false;
  }, [formData, step]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    [
      formData.addPages,
      formData.addPagesCount,
      formData.businessCards,
      formData.logoDesign,
      formData.designPlan,
      formData.subscriptionPlan,
    ],
  );
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
              {isPolish
                ? "Zamów stronę na zamówienie."
                : "Launch custom website."}
            </h1>
            <p className="text-base text-black/70">
              {isPolish
                ? "Zaprojektujemy, wdrożymy i uruchomimy stronę za Ciebie. Nie musisz nic robić — po prostu podziel się pomysłem! Fajnie, prawda?"
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
                              {designPlans.map((plan, planIndex) => (
                                <OptionCard
                                  key={plan.id}
                                  title={plan.title}
                                  price={plan.price}
                                  showVat
                                  dots={[
                                    ...designPlans
                                      .slice(0, planIndex)
                                      .map((tier) => tier.color),
                                    plan.color,
                                  ]}
                                  dotsLabel={
                                    isPolish
                                      ? `Zawiera: ${designPlans
                                          .slice(0, planIndex + 1)
                                          .map((tier) => tier.shortLabel)
                                          .join(" + ")}`
                                      : `Includes: ${designPlans
                                          .slice(0, planIndex + 1)
                                          .map((tier) => tier.shortLabel)
                                          .join(" + ")}`
                                  }
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
                              {isPolish ? "Hosting" : "Hosting"}
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
                                    price={plan.price}
                                    showVat
                                    details={plan.details}
                                    dots={
                                      plan.id === "standard-site"
                                        ? ["#1e40af"]
                                        : plan.id === "ecommerce-site"
                                          ? ["#1e40af", "#ffffff"]
                                          : []
                                    }
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
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">
                              Content Management
                            </h2>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            {backendOptions.map((option) => {
                              const isActive =
                                formData.backendOption === option.id;
                              const lockReason =
                                getBackendLockReasonForOption(option.id);
                              const isLocked = Boolean(lockReason);
                              const cmsPrice =
                                option.id === "wordpress"
                                  ? "€199"
                                  : option.id === "woocommerce"
                                    ? "€299"
                                    : option.id === "static"
                                      ? "€0"
                                      : option.id === "other"
                                        ? isPolish
                                          ? "Wycena indywidualna"
                                          : "Custom quote"
                                        : "";
                              const strikePrice =
                                option.id === "wordpress" ||
                                option.id === "woocommerce";
                              return (
                                <OptionCard
                                  key={option.id}
                                  title={option.title}
                                  price={cmsPrice}
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

                      {step === 2 && (
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
                                isPolish ? "200 € / strona" : "€200 per page"
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
                              price={isPolish ? "500 €" : "€500"}
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
                              price={isPolish ? "130 €" : "€130"}
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
                                  ? "Wycena indywidualna"
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
                                  ? "Wycena indywidualna"
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

                      {step === 3 && (
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
                                  // TODO: trigger payment flow
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
                              <span className="text-sm text-black/70">
                                {isPolish
                                  ? "Po wysłaniu formularza rozpoczynamy rozliczenie subskrypcji. Opłatę za projekt wyślemy po pierwszym spotkaniu."
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
                        {estOneTime > 0 ? `€${estOneTime}` : ""}
                        {estMonthly > 0
                          ? `${estOneTime > 0 ? " + " : ""}€${estMonthly}/mo`
                          : ""}
                        {estOneTime === 0 && estMonthly === 0 ? "—" : ""}
                        {estOneTime > 0 || estMonthly > 0 ? " + VAT" : ""}
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
                            ? "Projekty są wyceniane indywidualnie i cena może się nieznacznie zmienić. Płatność za projekt następuje po pierwszym spotkaniu."
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
              <ul className="mt-3 space-y-2">
                <li>
                  {isPolish
                    ? "Otrzymasz mail z podsumowaniem i czasem spotkania."
                    : "You will receive a recap and meeting proposal via email."}
                </li>
                <li>
                  {isPolish
                    ? "Doprecyzujemy zakres i harmonogram wdrożenia."
                    : "We will align the scope and delivery schedule."}
                </li>
                <li>
                  {isPolish
                    ? "Po akceptacji ruszamy z projektem."
                    : "Once approved, we start the build."}
                </li>
                <li>
                  {isPolish
                    ? "Masz pytania? Skorzystaj z zakładki"
                    : "If you have any questions, please use the"}{" "}
                  <Link
                    href="/contact"
                    className="underline underline-offset-4"
                  >
                    {isPolish ? "strony Kontakt" : "Contact page"}
                  </Link>
                </li>
              </ul>
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
                  <span className="text-sm text-black/70">
                    {isPolish
                      ? "Po wysłaniu formularza rozpoczynamy rozliczenie subskrypcji. Opłatę za projekt wyślemy po pierwszym spotkaniu."
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
