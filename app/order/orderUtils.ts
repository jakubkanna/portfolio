import type { FormState } from "./orderTypes";

export const normalizeForm = (next: FormState): FormState => {
  const normalized = { ...next };

  if (normalized.designPlan === "minimal") {
    normalized.backendOption = "static";
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
  return "";
};

export const computeEstimates = (formData: FormState) => {
  const designPriceMap: Record<string, number> = {
    minimal: 299,
    standard: 499,
    advanced: 1057,
  };
  const cmsPriceMap: Record<string, number> = {
    wordpress: 199,
    woocommerce: 469,
    static: 0,
  };
  const addOnTotal =
    (formData.addPages ? formData.addPagesCount * 200 : 0) +
    (formData.businessCards ? 130 : 0) +
    (formData.logoDesign ? 500 : 0) +
    (formData.installationPlan === "assist" ? 100 : 0);

  const designBase = designPriceMap[formData.designPlan] ?? 0;
  const cmsBase = cmsPriceMap[formData.backendOption] ?? 0;
  return {
    estOneTime: designBase + cmsBase + addOnTotal,
    estMonthly: 0,
  };
};
