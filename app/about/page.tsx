"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import AnimatedText from "../components/AnimatedText";
import { motion } from "motion/react";
import { useI18n } from "../hooks/useI18n";

export default function AboutPage() {
  const { t } = useI18n();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--page-bg", "#f8f8f8");
    root.style.setProperty("--page-fg", "#0a0a0a");
    return () => {
      root.style.removeProperty("--page-bg");
      root.style.removeProperty("--page-fg");
    };
  }, []);

  return (
    <motion.main
      className="relative flex min-h-screen flex-col bg-[#f8f8f8] text-[#0a0a0a] overflow-hidden"
      initial={{ backgroundColor: "#f8f8f8", color: "#0a0a0a", opacity: 0 }}
      animate={{ backgroundColor: "#f8f8f8", color: "#0a0a0a", opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="about-bg" aria-hidden="true" />
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <AnimatedText
          className="max-w-4xl text-xl font-normal leading-snug text-[#111111] md:text-3xl"
          textStyle={{
            textShadow:
              "0 0 2px rgba(255, 255, 255, 0.95), 0 0 6px rgba(255, 255, 255, 0.9), 0 0 14px rgba(255, 255, 255, 0.85), 0 0 24px rgba(255, 255, 255, 0.8)",
          }}
          message={[
            <React.Fragment key="line-1">
              {t.about.line1}
              <br />
            </React.Fragment>,
            <React.Fragment key="line-2">
              {t.about.line2}
              <br />
            </React.Fragment>,
            <React.Fragment key="line-3">
              {t.about.line3Prefix}{" "}
              <Link
                href="/catalog"
                className="text-blue-600 underline underline-offset-4 hover:text-blue-700 "
              >
                {t.about.catalogLink}
              </Link>{" "}
              {t.about.line3Or}{" "}
              <Link
                href="/contact"
                className="text-blue-600 underline underline-offset-4 hover:text-blue-700 "
              >
                {t.about.contactLink}
              </Link>{" "}
              {t.about.line3Suffix}
            </React.Fragment>,
          ]}
        />
      </section>

      <style jsx>{`
        .about-bg {
          position: absolute;
          inset: -10%;
          background-image: url("/jakubkanna.png");
          background-size: 200px auto;
          background-position: 72% 40%;
          background-repeat: no-repeat;
          opacity: 0;
          animation:
            fade-in 1.2s ease 0.6s forwards,
            drift 18s ease-in-out 0.6s infinite;
          z-index: 0;
          pointer-events: none;
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
