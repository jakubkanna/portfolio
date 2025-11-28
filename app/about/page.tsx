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
              We are a studio founded by artist Jakub Kanna.
              <br />
            </React.Fragment>,
            <React.Fragment key="line-2">
              We specialize in using technology to deliver work defined by
              conceptual freedom and contemporary design needs.
              <br />
            </React.Fragment>,
            <React.Fragment key="line-3">
              Check out our{" "}
              <Link href="/portfolio" className="underline underline-offset-4">
                portfolio
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="underline underline-offset-4">
                contact us
              </Link>{" "}
              to bring your idea to life. 🌸
            </React.Fragment>,
          ]}
        />
      </section>
    </main>
  );
}
