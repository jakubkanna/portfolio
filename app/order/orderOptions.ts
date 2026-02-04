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
            { text: "spotkania online (3)" },
            {
              text: "warianty (1)",
              note: "Maksymalna liczba dodatkowych wariantów projektu.",
            },
            { text: "Zawiera pakiet Minimal" },
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
              text: "warianty (2)",
              note: "Maksymalna liczba dodatkowych wariantów projektu.",
            },
            {
              text: "struktura wielojęzyczna",
              note: "Przygotowana na kolejne wersje językowe.",
            },
            { text: "Zawiera pakiet Standard" },
          ],
        },
        {
          id: "institutional",
          title: "Institutional",
          shortLabel: "Instytucja",
          color: "#ffb3d5",
          price: "Wycena",
          details: [
            { text: "bez limitu stron" },
            {
              text: "funkcje custom",
              note: "Np. kalendarz wydarzeń, system biletów, archiwa.",
            },
            {
              text: "warianty (3)",
              note: "Maksymalna liczba dodatkowych wariantów projektu.",
            },
            { text: "Zawiera pakiet Advanced" },
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
            { text: "online meeting (1)" },
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
            { text: "online meetings (3)" },
            {
              text: "variants (1)",
              note: "Maximum number of additional design variants.",
            },
            { text: "Includes Minimal" },
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
              text: "variants (2)",
              note: "Maximum number of additional design variants.",
            },
            {
              text: "Multilingual-ready structure",
              note: "Prepared for additional language versions.",
            },
            { text: "Includes Standard" },
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
              text: "variants (3)",
              note: "Maximum number of additional design variants.",
            },
            { text: "Includes Advanced" },
          ],
        },
      ];

export const getSubscriptionPlans = (isPolish: boolean): SubscriptionPlan[] =>
  isPolish
    ? [
        {
          id: "standard-site",
          title: "Standard",
          price: "15 € / m",
          details: [
            { text: "hosting" },
            { text: "daily backup" },
            { text: "security and maintenance" },
          ],
        },
        {
          id: "ecommerce-site",
          title: "E-commerce",
          price: "29 € / m",
          details: [
            { text: "integracje: Shopify, WooCommerce i inne" },
            { text: "bezpieczne płatności" },
            { text: "zarządzanie produktami" },
            { text: "Zawiera plan Standard" },
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
            { text: "integrations: Shopify, WooCommerce, and more" },
            { text: "secure payments" },
            { text: "product management" },
            { text: "Includes Standard" },
          ],
        },
      ];

export const getBackendOptions = (isPolish: boolean): BackendOption[] =>
  isPolish
    ? [
        {
          id: "wordpress",
          title: "WordPress",
          details: "Klasyczny CMS z panelem do edycji treści na stronie.",
        },
        {
          id: "woocommerce",
          title: "WooCommerce",
          details: "Katalog produktów, wysyłka, ceny. Zarządzanie treścią w sklepie. Bez prowizji.",
        },
        {
          id: "static",
          title: "Statyczna",
          details: "Treści na stronie nie będą się zmieniać.",
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
          details: "Classic CMS with a content editing panel.",
        },
        {
          id: "woocommerce",
          title: "WooCommerce",
          details: "Product catalog, shipping, pricing. Store content management. Included at no extra cost.",
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
