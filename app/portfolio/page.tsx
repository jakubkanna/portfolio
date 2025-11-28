"use client";

import { useState } from "react";
import { motion } from "motion/react";

type Card = {
  title: string;
  href: string;
  poster: string;
};

const cards: Card[] = [
  {
    title: "Project One",
    href: "https://example.com/one",
    poster:
      "https://images.unsplash.com/photo-1522198682488-1b1ad5c75e66?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Project Two",
    href: "https://example.com/two",
    poster:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Project Three",
    href: "https://example.com/three",
    poster:
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Project Four",
    href: "https://example.com/four",
    poster:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Project Five",
    href: "https://example.com/five",
    poster:
      "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Project Six",
    href: "https://example.com/six",
    poster:
      "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=400&q=80",
  },
];

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
  >
    <path d="M7.5 6.75a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V8.81L7.53 17.78a.75.75 0 1 1-1.06-1.06L15.44 7.75H8.25a.75.75 0 0 1-.75-.75Z" />
  </svg>
);

function PortfolioCard({
  title,
  href,
  poster,
  locked = false,
}: Card & { locked?: boolean }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative block overflow-hidden rounded-2xl bg-zinc-800 transition-shadow"
      initial={{ scale: 1, zIndex: 0 }}
      whileHover={
        locked ? { scale: 1, zIndex: 0 } : { scale: 1.08, zIndex: 10 }
      }
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={locked ? { pointerEvents: "none" } : undefined}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-700">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-zinc-700" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt={title}
          className="h-full w-full object-cover transition duration-500"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2 text-sm uppercase tracking-wide text-foreground">
          <span className="truncate">{title}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full transition group-hover:opacity-100">
            <Arrow />
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default function PortfolioPage() {
  const rows: Card[][] = [];
  for (let i = 0; i < cards.length; i += 3) {
    rows.push(cards.slice(i, i + 3));
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-foreground">
      <div className="space-y-6">
        {rows.map((row, rowIdx) => {
          const isLast = rowIdx === rows.length - 1;
          return (
            <div
              key={`row-${rowIdx}`}
              className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {row.map((card) => (
                <PortfolioCard key={card.title} {...card} locked={isLast} />
              ))}

              {isLast && (
                <>
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 100%)",
                    }}
                  />
                  <a
                    href="https://instagram.com/studio.jkn"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="rounded-full border border-foreground/40 bg-black/70 px-4 py-2 text-sm font-semibold uppercase tracking-wide">
                      View more
                    </span>
                  </a>
                </>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
