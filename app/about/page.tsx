"use client";

import Link from "next/link";
import AnimatedText from "../components/AnimatedText";
import ModelViewerButton from "../components/ModelViewerButton";

export default function AboutPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-black text-foreground">
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <AnimatedText
          message={`View latest projects at <a href="https://instagram.com/studio.jkn" target="_blank"> @studio.jkn</a> 🌍`}
          after={
            <p className="mt-6 max-w-xl text-balance text-base text-foreground/70">
              Reach out for collaborations, experiments, and thoughtful digital
              builds. Crafted with Next.js + Tailwind.
            </p>
          }
        />
      </section>

      <ModelViewerButton href="/" tooltip="Back to sequence" />
    </main>
  );
}
