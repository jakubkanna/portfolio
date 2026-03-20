import type { FormState } from "./orderTypes";

export const INITIAL_STATE: FormState = {
  designPlan: "standard",
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
  installationPlan: "",
  domainOwnership: "",
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
        "Plan",
        "Domena",
        "CMS",
        "Dodatkowe usługi",
        "Instalacja",
        "Wprowadzenie",
      ]
    : [
        "Plan",
        "Domain",
        "CMS",
        "Additional services",
        "Installation",
        "Finish",
      ];
