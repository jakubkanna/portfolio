"use client";

import React from "react";
import Link from "next/link";
import AnimatedText from "../components/AnimatedText";

export default function AboutPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-black text-foreground">
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <AnimatedText
          message={[
            <React.Fragment key="line-1">
              Founded by artist Jakub Kanna, our studio merges technology with
              imagination.
              <br />
            </React.Fragment>,
            <React.Fragment key="line-2">
              We create work that embraces conceptual freedom and responds to
              the evolving language of contemporary design.
              <br />
            </React.Fragment>,
            <React.Fragment key="line-3">
              Take a look at our{" "}
              <Link href="/portfolio" className="underline underline-offset-4">
                portfolio
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="underline underline-offset-4">
                get in touch
              </Link>{" "}
              to bring your idea to life. 🌸
            </React.Fragment>,
          ]}
        />
      </section>
    </main>
  );
}
