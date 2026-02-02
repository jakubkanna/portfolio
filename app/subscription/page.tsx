"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import OptionCard from "../components/OptionCard";
import { useI18n } from "../hooks/useI18n";

type FormState = {
  designPlan: string;
  subscriptionPlan: string;
  backendOption: string;
  backendOther: string;
  addPages: boolean;
  addPagesCount: number;
  domainHelp: boolean;
  businessCards: boolean;
  mobileApp: boolean;
  additionalOther: boolean;
  additionalOtherText: string;
  email: string;
  displayName: string;
  existingWebsite: string;
  portfolioPdf: string;
  websiteExamples: string;
  shortBio: string;
  meetingDate: string;
};

type Detail = { text: string; note?: string };

type DesignPlan = {
  id: string;
  title: string;
  shortLabel: string;
  color: string;
  price: string;
  details: Detail[];
};

const INITIAL_STATE: FormState = {
  designPlan: "",
  subscriptionPlan: "",
  backendOption: "",
  backendOther: "",
  addPages: false,
  addPagesCount: 1,
  domainHelp: false,
  businessCards: false,
  mobileApp: false,
  additionalOther: false,
  additionalOtherText: "",
  email: "",
  displayName: "",
  existingWebsite: "",
  portfolioPdf: "",
  websiteExamples: "",
  shortBio: "",
  meetingDate: "",
};

export default function SubscriptionPage() {
  const { locale } = useI18n();
  const isPolish = locale === "pl";
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);

  useEffect(() => {
    document.title = isPolish ? "Subskrypcja" : "Subscription";
  }, [isPolish]);

  useEffect(() => {
    if (formData.designPlan !== "minimal") return;
    setFormData((prev) =>
      prev.backendOption === "static"
        ? prev
        : { ...prev, backendOption: "static" },
    );
  }, [formData.designPlan]);

  useEffect(() => {
    if (formData.subscriptionPlan !== "standard-site") return;
    if (formData.backendOption !== "woocommerce") return;
    setFormData((prev) => ({ ...prev, backendOption: "" }));
  }, [formData.subscriptionPlan, formData.backendOption]);

  const designPlans = useMemo(
    () =>
      isPolish
        ? [
            {
              id: "minimal",
              title: "Minimal",
              shortLabel: "Minimal",
              color: "#19c37d",
              price: "299 €",
              details: [
                { text: "1 strona" },
                { text: "indywidualny projekt" },
                { text: "1 spotkanie online" },
                { text: "responsywny układ" },
              ],
            },
            {
              id: "standard",
              title: "Standard Design",
              shortLabel: "Standard",
              color: "#00b2ff",
              price: "499 €",
              details: [
                { text: "do 3 stron" },
                { text: "podstawowe SEO" },
                { text: "3 spotkania online" },
                {
                  text: "1 breaking change",
                  note: "Maksymalna liczba zmian. Zmiana layoutu lub koncepcji wymagająca pełnego redesignu.",
                },
              ],
            },
            {
              id: "advanced",
              title: "Advanced Design",
              shortLabel: "Advanced",
              color: "#f5c542",
              price: "1299 €",
              details: [
                { text: "do 5 stron" },
                { text: "animacje / 3D" },
                {
                  text: "2 breaking changes",
                  note: "Maksymalna liczba zmian. Duże zmiany layoutu lub idei z pełnym redesignem.",
                },
                {
                  text: "struktura wielojęzyczna",
                  note: "Przygotowana na kolejne wersje językowe.",
                },
              ],
            },
            {
              id: "institutional",
              title: "Institutional",
              shortLabel: "Instytucja",
              color: "#ff2f8c",
              price: "Wycena indywidualna",
              details: [
                { text: "bez limitu stron" },
                {
                  text: "funkcje custom",
                  note: "Np. kalendarz wydarzeń, system biletów, archiwa.",
                },
                {
                  text: "3 breaking changes",
                  note: "Maksymalna liczba zmian. Kolejne pełne redesigny po zmianie koncepcji.",
                },
              ],
            },
          ]
        : [
            {
              id: "minimal",
              title: "Minimal Design Page",
              shortLabel: "Minimal",
              color: "#19c37d",
              price: "€299",
              details: [
                { text: "Single page" },
                { text: "Individual visual design" },
                { text: "1 online meeting" },
                { text: "Responsive layout" },
              ],
            },
            {
              id: "standard",
              title: "Standard Design",
              shortLabel: "Standard",
              color: "#00b2ff",
              price: "€499",
              details: [
                { text: "Up to 3 pages" },
                { text: "Basic SEO setup" },
                { text: "3 online meetings" },
                {
                  text: "1 breaking change",
                  note: "Maximum number of changes. Layout- or idea-breaking change requiring a full redesign.",
                },
              ],
            },
            {
              id: "advanced",
              title: "Advanced Design",
              shortLabel: "Advanced",
              color: "#f5c542",
              price: "€1299",
              details: [
                { text: "Up to 5 pages" },
                { text: "Motion design / 3D" },
                {
                  text: "2 breaking changes",
                  note: "Maximum number of changes. Major layout or concept shifts with full redesigns.",
                },
                {
                  text: "Multilingual-ready structure",
                  note: "Prepared for additional language versions.",
                },
              ],
            },
            {
              id: "institutional",
              title: "Institutional",
              shortLabel: "Institutional",
              color: "#ff2f8c",
              price: "Custom quote",
              details: [
                { text: "No page limit" },
                {
                  text: "Custom functions",
                  note: "Examples: event calendars, ticketing, archives.",
                },
                {
                  text: "3 breaking changes",
                  note: "Maximum number of changes. Additional full redesigns after concept changes.",
                },
              ],
            },
          ],
    [isPolish],
  );

  const subscriptionPlans = useMemo(
    () =>
      isPolish
        ? [
            {
              id: "standard-site",
              title: "Standard Website",
              price: "15 € / miesiąc",
              details: [
                { text: "hosting + aktualizacje" },
                { text: "backupy i monitoring" },
                { text: "małe zmiany treści" },
              ],
            },
            {
              id: "ecommerce-site",
              title: "E-commerce Website",
              price: "29 € / miesiąc",
              details: [
                { text: "WooCommerce" },
                { text: "bezpieczne płatności" },
                { text: "wsparcie techniczne" },
              ],
            },
          ]
        : [
            {
              id: "standard-site",
              title: "Standard Website",
              price: "€15 / month",
              details: [
                { text: "hosting + updates" },
                { text: "backups and monitoring" },
                { text: "minor content changes" },
              ],
            },
            {
              id: "ecommerce-site",
              title: "E-commerce Website",
              price: "€29 / month",
              details: [
                { text: "WooCommerce support" },
                { text: "secure payments" },
                { text: "technical support" },
              ],
            },
          ],
    [isPolish],
  );

  const backendOptions = useMemo(
    () =>
      isPolish
        ? [
            {
              id: "wordpress",
              title: "WordPress",
              details: "Klasyczny CMS z panelem do treści.",
            },
            {
              id: "woocommerce",
              title: "WooCommerce",
              details: "Sklep, katalog produktów i płatności.",
            },
            {
              id: "static",
              title: "No CMS",
              details: "Strona statyczna, bez potrzeby aktualizacji.",
            },
            {
              id: "other",
              title: "Inny",
              details: "Np. headless CMS lub rozwiązanie custom.",
            },
            {
              id: "advice",
              title: "Potrzebuję rekomendacji",
              details: "Dopasujemy CMS po rozmowie.",
            },
          ]
        : [
            {
              id: "wordpress",
              title: "WordPress",
              details: "Classic CMS with a content panel.",
            },
            {
              id: "woocommerce",
              title: "WooCommerce",
              details: "Storefront, catalog, payments.",
            },
            {
              id: "static",
              title: "No CMS",
              details: "Static site, doesn't require updates.",
            },
            {
              id: "other",
              title: "Other",
              details: "Headless CMS or custom stack.",
            },
            {
              id: "advice",
              title: "I need a recommendation",
              details: "We will match the CMS after a call.",
            },
          ],
    [isPolish],
  );

  const stepTitles = isPolish
    ? ["Plan i zamówienie", "CMS", "Dodatkowe usługi", "Wprowadzenie"]
    : ["Plan & order", "CMS", "Additional services", "Introduction"];

  const cmsHint = isPolish
    ? "CMS to system zarządzania treścią strony."
    : "CMS = content management system for your site.";

  const getBackendLockReason = (optionId: string) => {
    if (!formData.designPlan) {
      return isPolish
        ? "Najpierw wybierz pakiet projektowy."
        : "Choose a design package first.";
    }
    if (formData.designPlan === "minimal") {
      return isPolish
        ? "Opcja zablokowana dla pakietu Minimal."
        : "Locked for the Minimal plan.";
    }
    if (
      formData.subscriptionPlan === "standard-site" &&
      optionId === "woocommerce"
    ) {
      return isPolish
        ? "Opcja niedostępna dla planu Standard Website."
        : "Not available with the Standard Website subscription.";
    }
    return "";
  };

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
      return Boolean(formData.email && formData.displayName);
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
    setSubmitted(true);
  };

  const stepLabel = stepTitles[step] ?? "";

  return (
    <main className="relative min-h-screen bg-[#d9d9d9] px-6 pb-28 pt-24 text-[#0a0a0a] sm:px-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {isPolish
              ? "Zamów stronę na zamówienie."
              : "Launch custom website."}
          </h1>
          <p className="max-w-2xl text-base text-black/70">
            {isPolish
              ? "Wybierz pakiet, ustal backend i wprowadź podstawowe informacje. Otrzymasz szybką propozycję harmonogramu i kosztów."
              : "Pick a package, define the backend, and share the essentials. You will receive a clear timeline and pricing proposal."}
          </p>
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
                <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
                  {step === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {isPolish ? "Pakiety projektowe" : "Design packages"}
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
                                setFormData((prev) => ({
                                  ...prev,
                                  designPlan: plan.id,
                                }))
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold">{"Hosting"}</h2>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {subscriptionPlans.map((plan) => {
                            const isActive =
                              formData.subscriptionPlan === plan.id;
                            return (
                              <button
                                key={plan.id}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    subscriptionPlan: plan.id,
                                  }))
                                }
                                className={`rounded-2xl border p-4 text-left transition ${
                                  isActive
                                    ? "border-black/80 bg-white/10"
                                    : "border-black/20 bg-[#f0ff5e] hover:border-black/40"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <h3 className="text-base font-semibold">
                                    {plan.title}
                                  </h3>
                                  <span className="text-right text-xs font-mono text-black/70">
                                    <span className="block">{plan.price}</span>
                                    <span className="block text-[10px] text-black/50">
                                      est.
                                    </span>
                                    <span className="block text-[10px] text-black/50">
                                      + VAT
                                    </span>
                                  </span>
                                </div>
                                <ul className="mt-3 space-y-1 text-sm text-black/70">
                                  {plan.details.map((detail) => (
                                    <li key={detail.text}>• {detail.text}</li>
                                  ))}
                                </ul>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">CMS</h2>
                        <span className="group relative inline-flex items-center">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-black/60 transition group-hover:text-black">
                            ?
                          </span>
                          <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-56 -translate-x-1/2 rounded-lg border border-black/10 bg-black/90 px-3 py-2 text-xs text-white/85 opacity-0 shadow-lg transition group-hover:opacity-100">
                            {cmsHint}
                          </span>
                        </span>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {backendOptions.map((option) => {
                          const isActive = formData.backendOption === option.id;
                          const lockReason = getBackendLockReason(option.id);
                          const isLocked = Boolean(lockReason);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              disabled={isLocked}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  backendOption: option.id,
                                  backendOther:
                                    option.id === "other"
                                      ? prev.backendOther
                                      : "",
                                }))
                              }
                              className={`rounded-2xl border p-4 text-left transition ${
                                isLocked
                                  ? "cursor-not-allowed border-black/20 bg-[#f0ff5e] opacity-50"
                                  : isActive
                                    ? "border-black/80 bg-white/10"
                                    : "border-black/20 bg-[#f0ff5e] hover:border-black/40"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold">
                                  {option.title}
                                </h3>
                                {isLocked ? (
                                  <span className="group relative inline-flex items-center">
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-black/60 transition group-hover:text-black">
                                      ?
                                    </span>
                                    <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-56 -translate-x-1/2 rounded-lg border border-black/10 bg-black/90 px-3 py-2 text-xs text-white/85 opacity-0 shadow-lg transition group-hover:opacity-100">
                                      {lockReason}
                                    </span>
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-2 text-sm text-black/60">
                                {option.details}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                      {formData.backendOption === "other" ? (
                        <input
                          type="text"
                          value={formData.backendOther}
                          onChange={(event) =>
                            setFormData((prev) => ({
                              ...prev,
                              backendOther: event.target.value,
                            }))
                          }
                          placeholder={
                            isPolish
                              ? "Opisz preferowany CMS"
                              : "Describe the CMS you want"
                          }
                          className="mt-3 w-full rounded-xl border border-black/20 bg-[#f0ff5e] px-3 py-2 text-sm focus:border-black/60 focus:outline-none"
                        />
                      ) : null}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold">
                        {isPolish ? "Dodatkowe usługi" : "Additional services"}
                      </h2>
                      <div className="grid gap-4 md:grid-cols-2">
                        <OptionCard
                          title={isPolish ? "Dodatkowe strony" : "Add pages"}
                          price={isPolish ? "200 € / strona" : "€200 per page"}
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
                          title={
                            isPolish
                              ? "Dobór domeny i instalacja"
                              : "Domain choice & installation assistance"
                          }
                          price={isPolish ? "50 €" : "€50"}
                          showVat
                          isActive={formData.domainHelp}
                          onSelect={() =>
                            setFormData((prev) => ({
                              ...prev,
                              domainHelp: !prev.domainHelp,
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
                              : "Mobile app iOS/Android"
                          }
                          price={
                            isPolish ? "Wycena indywidualna" : "Custom quote"
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
                          title={isPolish ? "Inne" : "Other"}
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
                        {isPolish ? "Email" : "Email"}
                        <input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={
                            isPolish ? "np. studio@..." : "e.g. studio@..."
                          }
                          className="rounded-xl border border-black/20 bg-[#f0ff5e] px-3 py-2 text-sm focus:border-black/60 focus:outline-none"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm">
                        {isPolish ? "Imię i nazwisko" : "Full name"}
                        <input
                          name="displayName"
                          type="text"
                          required
                          value={formData.displayName}
                          onChange={handleInputChange}
                          placeholder={
                            isPolish ? "np. Anna Kowalska" : "e.g. Jane Doe"
                          }
                          className="rounded-xl border border-black/20 bg-[#f0ff5e] px-3 py-2 text-sm focus:border-black/60 focus:outline-none"
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
                        {isPolish ? "Krótki opis" : "Short bio"}
                        <textarea
                          name="shortBio"
                          value={formData.shortBio}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder={
                            isPolish
                              ? "Napisz kilka zdań o projekcie."
                              : "Write a few lines about the project."
                          }
                          className="rounded-xl border border-black/20 bg-[#f0ff5e] px-3 py-2 text-sm focus:border-black/60 focus:outline-none"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm sm:col-span-2">
                        {isPolish
                          ? "Propozycja terminu spotkania"
                          : "Preferred meeting date"}
                        <input
                          name="meetingDate"
                          type="date"
                          value={formData.meetingDate}
                          onChange={handleInputChange}
                          className="rounded-xl border border-black/20 bg-[#f0ff5e] px-3 py-2 text-sm focus:border-black/60 focus:outline-none"
                        />
                      </label>
                    </div>
                  )}

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
                    ) : (
                      <button
                        type="submit"
                        disabled={!canContinue}
                        className="rounded-full bg-black px-6 py-2 text-sm text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isPolish ? "Wyślij" : "Submit"}
                      </button>
                    )}
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
                  <div>
                    {[
                      formData.addPages
                        ? `${isPolish ? "Strony" : "Pages"} × ${
                            formData.addPagesCount
                          }`
                        : null,
                      formData.domainHelp
                        ? isPolish
                          ? "Domena + instalacja"
                          : "Domain + installation"
                        : null,
                      formData.businessCards
                        ? isPolish
                          ? "Wizytówki"
                          : "Business cards"
                        : null,
                      formData.mobileApp
                        ? isPolish
                          ? "Aplikacja mobilna"
                          : "Mobile app"
                        : null,
                      formData.additionalOther
                        ? formData.additionalOtherText ||
                          (isPolish ? "Inne" : "Other")
                        : null,
                    ]
                      .filter(Boolean)
                      .join(", ") || (isPolish ? "Brak" : "None")}
                  </div>
                </div>
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
          </aside>
        </div>
      </div>
    </main>
  );
}
