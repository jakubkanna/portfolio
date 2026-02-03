import type { FormState } from "./orderTypes";

export const normalizeForm = (next: FormState): FormState => {
  const normalized = { ...next };

  if (normalized.designPlan === "minimal") {
    normalized.backendOption = "static";
    if (normalized.subscriptionPlan === "ecommerce-site") {
      normalized.subscriptionPlan = "";
    }
  }

  if (
    normalized.subscriptionPlan === "standard-site" &&
    normalized.backendOption === "woocommerce"
  ) {
    normalized.backendOption = "";
  }

  if (
    normalized.subscriptionPlan === "ecommerce-site" &&
    (normalized.backendOption === "wordpress" ||
      normalized.backendOption === "static")
  ) {
    normalized.backendOption = "";
  }

  if (normalized.backendOption !== "other") {
    normalized.backendOther = "";
  }

  return normalized;
};

export const getBackendLockReason = (
  formData: FormState,
  optionId: string,
  isPolish: boolean,
) => {
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
    formData.subscriptionPlan === "ecommerce-site" &&
    (optionId === "wordpress" || optionId === "static")
  ) {
    return isPolish
      ? "Opcja niedostępna dla planu E-commerce."
      : "Not available with the E-commerce plan.";
  }
  if (
    formData.subscriptionPlan === "standard-site" &&
    optionId === "woocommerce"
  ) {
    return isPolish
      ? "Opcja niedostępna dla planu Standard Website."
      : "Not available with the Standard hosting plan.";
  }
  return "";
};

export const computeEstimates = (formData: FormState) => {
  const designPriceMap: Record<string, number> = {
    minimal: 299,
    standard: 499,
    advanced: 1299,
  };
  const monthlyPriceMap: Record<string, number> = {
    "standard-site": 15,
    "ecommerce-site": 29,
  };
  const addOnTotal =
    (formData.addPages ? formData.addPagesCount * 200 : 0) +
    (formData.businessCards ? 130 : 0) +
    (formData.logoDesign ? 500 : 0);

  const designBase = designPriceMap[formData.designPlan] ?? 0;
  const monthlyBase = monthlyPriceMap[formData.subscriptionPlan] ?? 0;
  return {
    estOneTime: designBase + addOnTotal,
    estMonthly: monthlyBase,
  };
};
