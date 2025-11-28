"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import ScrollSequence from "./components/ScrollSequence";
import Menu from "./components/Menu";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main
      ref={containerRef}
      className="relative min-h-[320vh] bg-black text-foreground"
    >
      <div className="fixed top-0 h-screen">
        <ScrollSequence scrollProgress={scrollYProgress} />
      </div>
      <Menu />
    </main>
  );
}
