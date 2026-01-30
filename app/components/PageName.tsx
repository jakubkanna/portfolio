"use client";

import Link from "next/link";
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

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const translated =
      index === 0
        ? ((t.pageName as Record<string, string>)[segment] ??
          formatLabel(segment))
        : formatLabel(segment);
    return { href, label: translated };
  });

  return (
    <div className="fixed top-6 right-6 z-20 select-none text-xs uppercase tracking-wide text-[#9a9a9a]">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <span key={crumb.href}>
            {!isLast ? (
              <>
                <Link href={crumb.href} className="hover:text-white">
                  {crumb.label}
                </Link>
                <span className="px-1 text-[#7c7c7c]">/</span>
              </>
            ) : (
              <span>{crumb.label}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
