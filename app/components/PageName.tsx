"use client";

import { usePathname } from "next/navigation";

function formatLabel(path: string) {
  const firstSegment = path.split("/").filter(Boolean)[0] ?? "";
  if (!firstSegment) return "";
  const spaced = firstSegment.replace(/[-_]+/g, " ");
  return spaced.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PageName() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const label = formatLabel(pathname);
  if (!label) return null;

  const isLightPage = pathname === "/about" || pathname === "/contact";
  const textClass = isLightPage ? "text-[#0a0a0a]" : "text-foreground";

  return (
    <div
      className={`pointer-events-none fixed top-6 right-6 z-20 select-none text-sm uppercase tracking-wide ${textClass}`}
    >
      {label}
    </div>
  );
}
