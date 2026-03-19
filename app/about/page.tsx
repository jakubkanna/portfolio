"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import AnimatedText from "../components/AnimatedText";
import { motion } from "motion/react";
import { useI18n } from "../hooks/useI18n";

export default function AboutPage() {
  const { t } = useI18n();
  const aboutTextShadow =
    "0 0 2px rgba(255, 255, 255, 0.95), 0 0 6px rgba(255, 255, 255, 0.9), 0 0 14px rgba(255, 255, 255, 0.85), 0 0 24px rgba(255, 255, 255, 0.8)";
  const containerRef = useRef<HTMLElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const parallaxRef = useRef({ tx: 0, ty: 0, x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState(0);
  const [introAnimationDone, setIntroAnimationDone] = useState(false);
  const sectionsCount = 3;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--page-bg", "#f8f8f8");
    root.style.setProperty("--page-fg", "#0a0a0a");
    return () => {
      root.style.removeProperty("--page-bg");
      root.style.removeProperty("--page-fg");
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const randomWithinMargins = () => {
      const marginX = 12;
      const marginY = 12;
      return {
        x: marginX + Math.random() * (100 - marginX * 2),
        y: marginY + Math.random() * (100 - marginY * 2),
      };
    };
    const randomHeight = () => 200 * (0.8 + Math.random() * 0.4);

    const backgrounds = container.querySelectorAll<HTMLElement>(".about-bg");
    backgrounds.forEach((background) => {
      const pos = randomWithinMargins();
      const height = randomHeight();
      background.style.backgroundPosition = `${pos.x}% ${pos.y}%`;
      background.style.backgroundSize = `auto ${height.toFixed(0)}px`;
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number(
          (visible.target as HTMLElement).dataset.sectionIndex ?? "0",
        );
        if (Number.isNaN(index)) return;
        setActiveSection(index);
      },
      {
        threshold: [0.5, 0.7],
      },
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (introAnimationDone) {
      container.style.overflowY = "auto";
      return;
    }

    container.style.overflowY = "hidden";
  }, [introAnimationDone]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.setProperty("--mouse-shift-x", "0px");
    container.style.setProperty("--mouse-shift-y", "0px");

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const onPointerMove = (event: PointerEvent) => {
      const movementX = Number.isFinite(event.movementX) ? event.movementX : 0;
      const movementY = Number.isFinite(event.movementY) ? event.movementY : 0;
      parallaxRef.current.tx = clamp(
        parallaxRef.current.tx + movementX * 0.25,
        -26,
        26,
      );
      parallaxRef.current.ty = clamp(
        parallaxRef.current.ty + movementY * 0.25,
        -26,
        26,
      );
    };

    let rafId = 0;
    const tick = () => {
      const state = parallaxRef.current;
      state.x = clamp(state.x + (state.tx - state.x) * 0.085, -22, 22);
      state.y = clamp(state.y + (state.ty - state.y) * 0.085, -22, 22);
      state.tx *= 0.94;
      state.ty *= 0.94;
      container.style.setProperty("--mouse-shift-x", `${state.x.toFixed(2)}px`);
      container.style.setProperty("--mouse-shift-y", `${state.y.toFixed(2)}px`);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    container.addEventListener("pointermove", onPointerMove);

    return () => {
      window.cancelAnimationFrame(rafId);
      container.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  const showChevron = useMemo(
    () => introAnimationDone && activeSection < sectionsCount - 1,
    [activeSection, introAnimationDone],
  );

  const scrollToNextSection = () => {
    const next = sectionRefs.current[activeSection + 1];
    if (!next) return;
    next.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.main
      ref={containerRef}
      className="relative h-screen snap-y snap-mandatory overflow-y-hidden bg-[#f8f8f8] text-[#0a0a0a]"
      initial={{ backgroundColor: "#f8f8f8", color: "#0a0a0a", opacity: 0 }}
      animate={{ backgroundColor: "#f8f8f8", color: "#0a0a0a", opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        data-section-index="0"
        className="relative flex min-h-screen snap-start flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        <div
          className="about-bg-wrap"
          style={{ "--parallax-depth": 0.8 } as React.CSSProperties}
        >
          <div
            className="about-bg about-bg-first"
            aria-hidden="true"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 90 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <AnimatedText
            className="max-w-4xl text-2xl font-normal leading-snug text-[#111111] md:text-4xl"
            textStyle={{
              textShadow: aboutTextShadow,
            }}
            onComplete={() => setIntroAnimationDone(true)}
            message={[
              <React.Fragment key="line-1">
                <span className="text-[1.3em] ">STUDIO</span>
                {t.about.introSuffix}
                <br />
              </React.Fragment>,
            ]}
          />
        </motion.div>
      </section>
      <section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        data-section-index="1"
        className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden px-6 text-center"
      >
        <div
          className="about-bg-wrap"
          style={{ "--parallax-depth": 0.7 } as React.CSSProperties}
        >
          <div
            className="about-bg about-bg-second-a"
            aria-hidden="true"
          />
        </div>
        <div
          className="about-bg-wrap"
          style={{ "--parallax-depth": 1.1 } as React.CSSProperties}
        >
          <div
            className="about-bg about-bg-second-b"
            aria-hidden="true"
          />
        </div>
        <div
          className="about-bg-wrap"
          style={{ "--parallax-depth": 0.9 } as React.CSSProperties}
        >
          <div
            className="about-bg about-bg-second-c"
            aria-hidden="true"
          />
        </div>
        <motion.div
          className="absolute inset-0 z-10 mx-auto w-full max-w-6xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.45, once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <motion.h2
            className="absolute left-6 top-[16%] max-w-[70%] text-left text-2xl font-normal md:left-[23%] md:top-[20%] md:max-w-none md:text-4xl"
            initial={{ x: 90 }}
            whileInView={{ x: 0 }}
            viewport={{ amount: 0.45 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ textShadow: aboutTextShadow }}
          >
            {t.about.section2Title}
          </motion.h2>
          <motion.p
            className="absolute bottom-[18%] left-6 w-[88%] text-left text-base text-black/75 md:left-[38%] md:top-[66%] md:w-[47%] md:text-xl"
            initial={{ x: 70 }}
            whileInView={{ x: 0 }}
            viewport={{ amount: 0.45 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
            style={{ textShadow: aboutTextShadow }}
          >
            {t.about.section2Desc}
          </motion.p>
        </motion.div>
      </section>
      <section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        data-section-index="2"
        className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden px-6 pb-24 text-center"
      >
        <div
          className="about-bg-wrap"
          style={{ "--parallax-depth": 0.75 } as React.CSSProperties}
        >
          <div
            className="about-bg about-bg-third-secondary"
            aria-hidden="true"
          />
        </div>
        <div
          className="about-bg-wrap"
          style={{ "--parallax-depth": 1.05 } as React.CSSProperties}
        >
          <div
            className="about-bg about-bg-third"
            aria-hidden="true"
          />
        </div>
        <div
          className="about-bg-wrap"
          style={{ "--parallax-depth": 0.92 } as React.CSSProperties}
        >
          <div
            className="about-bg about-bg-third-tertiary"
            aria-hidden="true"
          />
        </div>
        <motion.div
          className="absolute inset-0 z-10 mx-auto w-full max-w-6xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.45, once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <motion.p
            className="absolute bottom-[18%] left-6 w-[88%] text-left text-base text-black/75 md:left-[15%] md:top-[66%] md:w-[47%] md:text-xl"
            initial={{ x: -70 }}
            whileInView={{ x: 0 }}
            viewport={{ amount: 0.45 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
            style={{ textShadow: aboutTextShadow }}
          >
            {t.about.section3Desc}
          </motion.p>
          <motion.h2
            className="absolute right-6 top-[16%] max-w-[70%] text-right text-2xl font-normal md:right-[15%] md:top-[20%] md:max-w-none md:text-4xl"
            initial={{ x: -90 }}
            whileInView={{ x: 0 }}
            viewport={{ amount: 0.45 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ textShadow: aboutTextShadow }}
          >
            {t.about.section3Title}
          </motion.h2>
        </motion.div>
      </section>
      {showChevron ? (
        <button
          type="button"
          className="pointer-events-auto fixed bottom-20 left-1/2 z-30 -translate-x-1/2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
          onClick={scrollToNextSection}
          aria-label="Scroll to next section"
        >
          <svg
            className="block h-8 w-8 animate-pulse text-[#0a0a0a]"
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
        </button>
      ) : null}

      <style jsx>{`
        .about-bg-wrap {
          position: absolute;
          inset: -10%;
          pointer-events: none;
          z-index: 0;
          transform: translate3d(
            calc(var(--mouse-shift-x, 0px) * var(--parallax-depth, 1)),
            calc(var(--mouse-shift-y, 0px) * var(--parallax-depth, 1)),
            0
          );
          will-change: transform;
        }

        .about-bg {
          position: absolute;
          inset: 0;
          background-position: 50% 50%;
          background-size: auto 200px;
          background-repeat: no-repeat;
          opacity: 0;
          animation:
            fade-in 1.2s ease 0.6s forwards,
            drift 18s ease-in-out 0.6s infinite;
          z-index: 0;
          pointer-events: none;
        }

        .about-bg-first {
          background-image: url("/jakubkanna.png");
        }

        .about-bg-second-a {
          background-image: url("/screenshot_2026_03_11_at_15_54_52_opt.jpeg");
          filter: saturate(0.28) contrast(0.9);
        }

        .about-bg-second-b {
          background-image: url("/screenshot_2026_03_19_at_22_44_39_opt.jpeg");
          filter: saturate(0.3) contrast(0.92);
          animation:
            fade-in 1.2s ease 0.82s forwards,
            drift 20s ease-in-out 0.82s infinite reverse;
        }

        .about-bg-second-c {
          background-image: url("/screenshot_2026_03_19_at_22_45_49_opt.jpeg");
          filter: saturate(0.2) contrast(0.9);
          animation:
            fade-in 1.2s ease 1s forwards,
            drift 24s ease-in-out 1s infinite;
        }

        .about-bg-third {
          background-image: url("/img_1248_opt.jpeg");
          filter: saturate(0.2) contrast(0.9);
        }

        .about-bg-third-secondary {
          background-image: url("/toofasttolast_16x9_opt.jpeg");
          filter: saturate(0.3) contrast(0.92);
          animation:
            fade-in 1.2s ease 0.85s forwards,
            drift 22s ease-in-out 0.85s infinite reverse;
        }

        .about-bg-third-tertiary {
          background-image: url("/screenshot_2026_03_07_at_08_59_57_opt.jpeg");
          filter: saturate(0.24) contrast(0.9);
          animation:
            fade-in 1.2s ease 1.05s forwards,
            drift 20s ease-in-out 1.05s infinite;
        }

        @keyframes fade-in {
          to {
            opacity: 0.18;
          }
        }

        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1.03);
          }
          50% {
            transform: translate3d(-2%, 1.5%, 0) scale(1.05);
          }
        }

        section {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </motion.main>
  );
}
