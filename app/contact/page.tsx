"use client";

import AnimatedText from "../components/AnimatedText";

export default function ContactPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-black text-foreground">
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-28 text-center sm:pt-32">
        <div className="flex flex-col items-center justify-center text-center gap-6 text-lg sm:text-2xl">
          <AnimatedText
            message={
              <>
                Email{" "}
                <a href="mailto:hello.jakubkanna@gmail.com" target="_blank">
                  hello.jakubkanna@gmail.com
                </a>{" "}
                or drop a message via{" "}
                <a href={"https://instagram.com/studio.jkn "} target="_blank">
                  instagram DM
                </a>
              </>
            }
            sessionKey="contact"
          />
        </div>
      </section>
    </main>
  );
}
