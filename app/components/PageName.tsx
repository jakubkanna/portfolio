"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "../hooks/useI18n";

function formatLabel(path: string) {
  const firstSegment = path.split("/").filter(Boolean)[0] ?? "";
  if (!firstSegment) return "";
  const spaced = firstSegment.replace(/[-_]+/g, " ");
  return spaced.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PageName() {
  const pathname = usePathname();
  const { t } = useI18n();
  if (pathname === "/") return null;

  const label = formatLabel(pathname);
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  const translated =
    (t.pageName as Record<string, string>)[firstSegment] ?? label;
  if (!translated) return null;

  const isLightPage = pathname === "/about" || pathname === "/contact";
  const textClass = isLightPage ? "text-[#0a0a0a]" : "text-foreground";

  return (
    <div
      className={`pointer-events-none fixed top-6 right-6 z-20 select-none text-xs uppercase tracking-wide ${textClass}`}
    >
      {`> ` + translated}
    </div>
  );
}
