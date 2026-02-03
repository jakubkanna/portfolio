type PlanDetail = {
  text: string;
  note?: string;
};

type DesignPlan = {
  id: string;
  title: string;
  shortLabel: string;
  color: string;
  price: string;
  details: PlanDetail[];
};

type SubscriptionPlan = {
  id: string;
  title: string;
  price: string;
  details: PlanDetail[];
};

type BackendOption = {
  id: string;
  title: string;
  details: string;
};

export const getDesignPlans = (isPolish: boolean): DesignPlan[] =>
  isPolish
    ? [
        {
          id: "minimal",
          title: "Minimal",
          shortLabel: "Minimal",
          color: "#8fe3b6",
          price: "299 €",
          details: [
            { text: "1 strona" },
            { text: "indywidualny projekt" },
            { text: "podstawowe SEO" },
            { text: "1 spotkanie online" },
            { text: "wersja mobilna w cenie" },
          ],
        },
        {
          id: "standard",
          title: "Standard",
          shortLabel: "Standard",
          color: "#9ad8ff",
          price: "499 €",
          details: [
            { text: "do 3 stron" },
            { text: "3 spotkania online" },
            {
              text: "1 breaking change",
              note: "Maksymalna liczba zmian. Zmiana layoutu lub koncepcji wymagająca pełnego redesignu.",
            },
          ],
        },
        {
          id: "advanced",
          title: "Advanced",
          shortLabel: "Advanced",
          color: "#ffe08a",
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
          color: "#ffb3d5",
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
          title: "Minimal",
          shortLabel: "Minimal",
          color: "#8fe3b6",
          price: "€299",
          details: [
            { text: "Single page" },
            { text: "Individual visual design" },
            { text: "Basic SEO setup" },
            { text: "1 online meeting" },
            { text: "Mobile version included" },
          ],
        },
        {
          id: "standard",
          title: "Standard",
          shortLabel: "Standard",
          color: "#9ad8ff",
          price: "€499",
          details: [
            { text: "Up to 3 pages" },
            { text: "3 online meetings" },
            {
              text: "1 breaking change",
              note: "Maximum number of changes. Layout- or idea-breaking change requiring a full redesign.",
            },
          ],
        },
        {
          id: "advanced",
          title: "Advanced",
          shortLabel: "Advanced",
          color: "#ffe08a",
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
          color: "#ffb3d5",
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
      ];

export const getSubscriptionPlans = (isPolish: boolean): SubscriptionPlan[] =>
  isPolish
    ? [
        {
          id: "standard-site",
          title: "Standard",
          price: "15 € / miesiąc",
          details: [
            { text: "hosting" },
            { text: "daily backup" },
            { text: "security and maintenance" },
          ],
        },
        {
          id: "ecommerce-site",
          title: "E-commerce",
          price: "29 € / miesiąc",
          details: [
            { text: "unlimited listings" },
            { text: "no fees" },
            { text: "secure payments" },
          ],
        },
      ]
    : [
        {
          id: "standard-site",
          title: "Standard",
          price: "€15 / month",
          details: [
            { text: "hosting" },
            { text: "daily backup" },
            { text: "security and maintenance" },
          ],
        },
        {
          id: "ecommerce-site",
          title: "E-commerce",
          price: "€29 / month",
          details: [
            { text: "unlimited listings" },
            { text: "no fees" },
            { text: "secure payments" },
          ],
        },
      ];

export const getBackendOptions = (isPolish: boolean): BackendOption[] =>
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
          title: "Static",
          details: "Content on the website won't change.",
        },
        {
          id: "other",
          title: "Inny",
          details: "Np. headless CMS lub rozwiązanie custom.",
        },
      ]
    : [
        {
          id: "wordpress",
          title: "WordPress",
          details: "Classic Admin Dashboard.",
        },
        {
          id: "woocommerce",
          title: "WooCommerce",
          details: "Storefront, catalog, payments.",
        },
        {
          id: "static",
          title: "Static",
          details: "Content on the website won't change.",
        },
        {
          id: "other",
          title: "Other",
          details: "Headless CMS or custom stack.",
        },
      ];
