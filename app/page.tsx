"use client";

import Link from "next/link";
import { useRef } from "react";
import { useScroll } from "motion/react";
import ScrollSequence from "./components/ScrollSequence";
import ModelViewerButton from "./components/ModelViewerButton";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main
      ref={containerRef}
      className="relative min-h-[220vh] bg-black text-foreground"
    >
      <div className="sticky top-0 h-screen">
        <ScrollSequence scrollProgress={scrollYProgress} />
      </div>

      <div className="h-[40vh]" />

      <ModelViewerButton href="/about" tooltip="Jump to about page" />
    </main>
  );
}
