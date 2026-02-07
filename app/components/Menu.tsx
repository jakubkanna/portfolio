"use client";

import Button from "./Button";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "../hooks/useI18n";

type NavItem = {
  key: "home" | "about" | "catalog" | "subscription" | "contact";
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "catalog", href: "/catalog" },
  { key: "subscription", href: "/order" },
  { key: "contact", href: "/contact" },
];

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
  isCatalog,
}: {
  items: Array<NavItem & { label: string }>;
  onNavigate: (href: string) => void;
  isCatalog: boolean;
}) {
  const YEAR = new Date().getFullYear(); // ← add this line
  const shouldReduceMotion = useReducedMotion();

  const baseContainerClass =
    "z-30 flex w-full flex-col items-center justify-center transition cursor-pointer gap-2 pb-3 sm:w-auto sm:flex-row sm:gap-0 sm:p-4";
  const containerClass = isCatalog
    ? `${baseContainerClass} relative pt-4`
    : `${baseContainerClass} relative p-3`;

  return (
    <nav className={containerClass} aria-label="Primary">
      <div className="pointer-events-none hidden text-xs sm:block mr-12 text-[#9a9a9a] font-mono">
        STUDIO JKN
      </div>
      <motion.div
        className="flex w-full max-w-[90vw] flex-wrap items-center justify-center gap-2 rounded-full bg-[rgb(18,18,18)]/85 p-1 sm:w-auto sm:max-w-none"
        style={{ transformOrigin: "center" }}
        initial={
          shouldReduceMotion
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 0, opacity: 0 }
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
      <div className="hidden text-xs text-center sm:block ml-12 text-[#9a9a9a] font-mono">
        © {YEAR}
      </div>
      <div className="pointer-events-none mt-2 flex w-full items-center justify-center gap-2 sm:hidden text-[#9a9a9a] font-mono text-xs">
        <div className="text-center">STUDIO JKN © {YEAR}</div>
      </div>
    </nav>
  );
}

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname === "/") {
    return <LandingCta onClick={() => router.push("/about")} />;
  }

  const isCatalog = pathname.startsWith("/catalog");
  const isLightPage = pathname === "/about" || pathname === "/contact";
  const textClass = isLightPage ? "text-[#0a0a0a]" : "text-foreground";
  const itemsWithLabels = NAV_ITEMS.map((item) => ({
    ...item,
    label: t.nav[item.key],
  }));

  return (
    <div className={textClass}>
      <MenuBar
        items={itemsWithLabels}
        isCatalog={isCatalog}
        onNavigate={(href) => router.push(href)}
      />
    </div>
  );
}
