"use client";

import { useMemo, useState } from "react";
import Button from "./Button";

export type FlipbookPage = {
  image: string;
  title: string;
  subtitle?: string;
};

type FlipbookProps = {
  pages: FlipbookPage[];
  className?: string;
};

export default function Flipbook({ pages, className = "" }: FlipbookProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const maxIndex = pages.length;

  const canPrev = pageIndex > 0;
  const canNext = pageIndex < maxIndex;

  const currentPage = useMemo(
    () => Math.min(pageIndex + 1, pages.length),
    [pageIndex, pages.length]
  );

  return (
    <section className={`space-y-4 ${className}`.trim()}>
      <div className="flipbook">
        <div className="flipbook-spread">
          {pages.map((page, index) => {
            const flipped = index < pageIndex;
            return (
              <div
                key={`${page.title}-${index}`}
                className="flipbook-page"
                style={{
                  zIndex: pages.length - index,
                  transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)",
                }}
              >
                <div className="flipbook-face flipbook-front">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.image}
                    alt={page.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="flipbook-caption">
                    <p className="text-sm uppercase tracking-[0.2em] text-foreground/80">
                      {page.title}
                    </p>
                    {page.subtitle && (
                      <p className="text-xs text-foreground/60">
                        {page.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flipbook-face flipbook-back">
                  <div className="flipbook-back-inner">
                    <span className="text-xs uppercase tracking-[0.3em] text-foreground/70">
                      {page.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.3em] text-foreground/60">
          Page {currentPage} of {pages.length}
        </div>
        <div className="flex items-center gap-3">
          <Button
            label="Prev"
            variant="outline"
            action={() => canPrev && setPageIndex((prev) => prev - 1)}
            className={canPrev ? "" : "pointer-events-none opacity-40"}
          />
          <Button
            label="Next"
            variant="background"
            action={() => canNext && setPageIndex((prev) => prev + 1)}
            className={canNext ? "" : "pointer-events-none opacity-40"}
          />
        </div>
      </div>

      <style jsx global>{`
        .flipbook {
          perspective: 1800px;
        }

        .flipbook-spread {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
        }

        .flipbook-page {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform-origin: left center;
          transition: transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .flipbook-face {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          overflow: hidden;
          backface-visibility: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.06);
        }

        .flipbook-front {
          background: #0a0a0a;
        }

        .flipbook-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, #111 0%, #050505 100%);
        }

        .flipbook-back-inner {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flipbook-caption {
          position: absolute;
          left: 18px;
          bottom: 16px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(8px);
        }

        @media (max-width: 768px) {
          .flipbook-spread {
            aspect-ratio: 3 / 4;
          }
        }
      `}</style>
    </section>
  );
}
