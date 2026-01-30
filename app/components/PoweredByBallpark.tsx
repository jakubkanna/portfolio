"use client";

import Link from "next/link";

export default function PoweredByBallpark() {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Link
        href="https://ballpark.ing"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-lg backdrop-blur hover:bg-white"
        aria-label="Powered by Ballpark"
      >
        Powered by Ballpark
      </Link>
    </div>
  );
}
