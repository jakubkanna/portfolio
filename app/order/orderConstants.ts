import type { FormState } from "./orderTypes";

export const INITIAL_STATE: FormState = {
  designPlan: "standard",
  subscriptionPlan: "standard-site",
  backendOption: "wordpress",
  backendOther: "",
  addPages: false,
  addPagesCount: 1,
  businessCards: false,
  mobileApp: false,
  logoDesign: false,
  socialPost: true,
  additionalOther: false,
  additionalOtherText: "",
  domainPlan: "",
  domainName: "",
  customEmail: false,
  customEmailAlias: "",
  acceptTerms: false,
  email: "",
  displayName: "",
  existingWebsite: "",
  portfolioPdf: "",
  websiteExamples: "",
  shortBio: "",
  meetingDate: "",
};

export const getStepTitles = (isPolish: boolean) =>
  isPolish
    ? [
        "Plan i zamówienie",
        "Domena",
        "CMS",
        "Dodatkowe usługi",
        "Wprowadzenie",
      ]
    : ["Plan & order", "Domain", "CMS", "Additional services", "Introduction"];
