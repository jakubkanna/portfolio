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
      className="relative flex min-h-screen flex-col bg-[#f8f8f8] text-[#0a0a0a]"
      initial={{ backgroundColor: "#f8f8f8", color: "#0a0a0a", opacity: 0 }}
      animate={{ backgroundColor: "#f8f8f8", color: "#0a0a0a", opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <AnimatedText
          className="max-w-4xl text-xl font-normal leading-snug text-[#111111] md:text-3xl "
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
                href="/portfolio"
                className="text-blue-600 underline underline-offset-4 hover:text-blue-700 "
              >
                {t.about.portfolioLink}
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
    </motion.main>
  );
}
