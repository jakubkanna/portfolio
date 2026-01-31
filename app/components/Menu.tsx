"use client";

import Button from "./Button";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "../hooks/useI18n";

type NavItem = {
  key: "home" | "about" | "portfolio" | "estimate" | "contact";
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "portfolio", href: "/portfolio" },
  { key: "estimate", href: "/estimate" },
  { key: "contact", href: "/contact" },
];

const FORM_ID_EN = "EkWdAq";
const FORM_ID_PL = "0QOByP";

type TallyWindow = Window & {
  Tally?: {
    openPopup: (formId: string, options?: Record<string, unknown>) => void;
  };
};

function ChevronDownIcon() {
  return (
    <svg
      className="block h-8 w-8 animate-pulse cursor-pointer"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"
      />
    </svg>
  );
}

function LandingCta({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="pointer-events-auto fixed bottom-6 left-1/2 z-30 -translate-x-1/2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
      onClick={onClick}
      aria-label="Learn more about me"
    >
      <ChevronDownIcon />
    </button>
  );
}

function MenuBar({
  items,
  onNavigate,
  isPortfolio,
}: {
  items: Array<NavItem & { label: string }>;
  onNavigate: (href: string) => void;
  isPortfolio: boolean;
}) {
  const YEAR = new Date().getFullYear(); // ← add this line
  const shouldReduceMotion = useReducedMotion();

  const baseContainerClass =
    "z-30 flex w-full flex-col items-center justify-center transition cursor-pointer gap-2 pb-3 sm:w-auto sm:flex-row sm:gap-0 sm:p-3";
  const containerClass = isPortfolio
    ? `${baseContainerClass} relative pt-4`
    : `${baseContainerClass} relative p-3`;

  return (
    <nav className={containerClass} aria-label="Primary">
      <div className="hidden text-xs sm:block mr-12 opacity-25 font-mono">
        STUDIO JKN
      </div>
      <motion.div
        className="flex w-full max-w-[90vw] flex-wrap items-center justify-center gap-2 rounded-full bg-[rgb(18,18,18)]/85 p-1 sm:w-auto sm:max-w-none"
        style={{ transformOrigin: "center" }}
        initial={
          shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
        }
        animate={
          shouldReduceMotion
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: [0, 1.06, 0.98, 1], opacity: [0, 1, 1, 1] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.38, ease: [0.22, 1.25, 0.36, 1] }
        }
      >
        {items.map((item) => (
          <Button
            key={item.label}
            label={item.label}
            variant="link"
            className={`rounded-full md:text-lg p-5 text-white hover:bg-black hover:text-white ${
              item.key === "home" ? "hidden sm:inline-flex" : ""
            }`.trim()}
            action={() => onNavigate(item.href)}
          />
        ))}
      </motion.div>
      <div className="hidden text-xs text-center sm:block ml-12 opacity-25 font-mono">
        © {YEAR}
      </div>
      <div className="mt-2 flex w-full items-center justify-center gap-2 sm:hidden opacity-25 font-mono text-xs">
        <div className="text-center">STUDIO JKN © {YEAR}</div>
      </div>
    </nav>
  );
}

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, t } = useI18n();

  if (pathname === "/estimate") {
    return null;
  }

  if (pathname === "/") {
    return <LandingCta onClick={() => router.push("/about")} />;
  }

  const isPortfolio = pathname.startsWith("/portfolio");
  const isLightPage = pathname === "/about" || pathname === "/contact";
  const textClass = isLightPage ? "text-[#0a0a0a]" : "text-foreground";
  const itemsWithLabels = NAV_ITEMS.map((item) => ({
    ...item,
    label: t.nav[item.key],
  }));

  const handleEstimate = () => {
    const formId = locale === "pl" ? FORM_ID_PL : FORM_ID_EN;
    const open = () => {
      const tally = (window as TallyWindow).Tally;
      if (!tally?.openPopup) return;
      tally.openPopup(formId, {
        doNotShowAfterSubmit: true,
      });
    };

    if ((window as TallyWindow).Tally?.openPopup) {
      open();
      return;
    }

    const waitForTally = () => {
      let attempts = 0;
      const tick = () => {
        attempts += 1;
        if ((window as TallyWindow).Tally?.openPopup) {
          open();
          return;
        }
        if (attempts < 60) {
          window.requestAnimationFrame(tick);
        }
      };
      tick();
    };

    if (!document.querySelector("script[data-tally-embed]")) {
      const script = document.createElement("script");
      script.src = "https://tally.so/widgets/embed.js";
      script.async = true;
      script.dataset.tallyEmbed = "true";
      script.onload = () => waitForTally();
      document.body.appendChild(script);
      return;
    }

    waitForTally();
  };

  return (
    <div className={textClass}>
      <MenuBar
        items={itemsWithLabels}
        isPortfolio={isPortfolio}
        onNavigate={(href) => {
          if (href === "/estimate") {
            handleEstimate();
            return;
          }
          router.push(href);
        }}
      />
    </div>
  );
}
