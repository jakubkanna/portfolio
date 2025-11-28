"use client";

export default function ContactPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-black text-foreground">
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-3xl mx-auto max-w-3xl text-balance font-semibold uppercase leading-tight  whitespace-pre-wrap">
            Email{" "}
            <a href="mailto:hello.jakubkanna@gmail.com" target="_blank">
              hello.jakubkanna@gmail.com
            </a>
          </p>
          <p className="text-3xl mx-auto max-w-3xl text-balance font-semibold uppercase leading-tight  whitespace-pre-wrap">
            or drop a message via{" "}
            <a href={"https://instagram.com/studio.jkn "} target="_blank">
              instagram DM
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
