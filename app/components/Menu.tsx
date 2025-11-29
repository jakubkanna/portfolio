"use client";

import Button from "./Button";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact us", href: "/contact" },
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
  isPortfolio,
}: {
  items: NavItem[];
  onNavigate: (href: string) => void;
  isPortfolio: boolean;
}) {
  const baseContainerClass =
    "z-30 flex w-full items-center justify-center opacity-50 transition cursor-pointer ";
  const containerClass = isPortfolio
    ? `${baseContainerClass} relative pt-12`
    : `${baseContainerClass} fixed bottom-0 left-0`;

  return (
    <nav className={containerClass} aria-label="Primary">
      {items.map((item) => (
        <Button
          key={item.label}
          label={item.label}
          variant="link"
          action={() => onNavigate(item.href)}
        />
      ))}
    </nav>
  );
}

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") {
    return <LandingCta onClick={() => router.push("/about")} />;
  }

  const isPortfolio = pathname.startsWith("/portfolio");

  return (
    <MenuBar
      items={NAV_ITEMS}
      isPortfolio={isPortfolio}
      onNavigate={(href) => router.push(href)}
    />
  );
}
