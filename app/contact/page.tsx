"use client";

import { useEffect } from "react";
import AnimatedText from "../components/AnimatedText";
import { motion } from "motion/react";
import { useI18n } from "../hooks/useI18n";

export default function ContactPage() {
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
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-28 text-center sm:pt-32">
        <div className="flex flex-col items-center justify-center text-center gap-6 text-lg sm:text-2xl">
          <AnimatedText
            message={
              <>
                {t.contact.emailLabel}{" "}
                <a href="mailto:hello.jakubkanna@gmail.com" target="_blank">
                  hello.jakubkanna@gmail.com
                </a>{" "}
                {t.contact.or}{" "}
                <a href="https://instagram.com/studio.jkn" target="_blank">
                  {t.contact.instagram}
                </a>
              </>
            }
            sessionKey="contact"
          />
        </div>
      </section>
    </motion.main>
  );
}
