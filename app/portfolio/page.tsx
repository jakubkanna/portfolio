"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Button from "../components/Button";

type Card = {
  title: string;
  href: string;
  poster: string;
  video?: string;
};

const cards: Card[] = [
  {
    title: "Coming Soon",
    href: "/#",
    poster: "/portfolio/dimitra.jpg",
  },
  {
    title: "Rita Borralho Silva",
    href: "https://ritaborralhosilva.com/",
    poster: "/portfolio/pillow.jpg",
    video: "/portfolio/pillow.mp4",
  },
  {
    title: "INSIDE JOB",
    href: "https://michalknychaus.com/",
    poster: "/portfolio/insidejob.jpg",
    video: "/portfolio/insidejob.mp4",
  },
  {
    title: "Jakub Kanna",
    href: "/",
    poster: "/portfolio/jknew.jpg",
  },
  {
    title: "Portfolio old",
    href: "/",
    poster: "/portfolio/jkold.jpg",
  },
  {
    title: "Project Six",
    href: "https://izabelasitarska.com",
    poster: "/portfolio/is.jpg",
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
  video,
  locked = false,
}: Card & { locked?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [poster]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (hovered && video) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
      vid.currentTime = 0;
    }
  }, [hovered, video]);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative block overflow-hidden rounded-2xl bg-blue-900 transition-shadow"
      initial={{ scale: 1, zIndex: 0 }}
      whileHover={
        locked ? { scale: 1, zIndex: 0 } : { scale: 1.08, zIndex: 10 }
      }
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={locked ? { pointerEvents: "none" } : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-blue-900">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-blue-800" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={poster}
          alt={title}
          className="h-full w-full object-cover transition duration-500"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
        {video && (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
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
    <main className="min-h-screen bg-black px-6 py-20 text-foreground">
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
                  <div className="absolute inset-0 z-10 flex items-center justify-center no-underline">
                    <Button
                      label={
                        <span className="inline-flex items-center gap-2">
                          View more <Arrow />
                        </span>
                      }
                      variant="background"
                      action={() =>
                        window.open(
                          "https://instagram.com/studio.jkn",
                          "_blank"
                        )
                      }
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
