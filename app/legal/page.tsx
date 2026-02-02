"use client";

import { useEffect } from "react";

export default function LegalPage() {
  useEffect(() => {
    document.title = "Privacy & Terms";
  }, []);

  return (
    <main className="min-h-screen bg-[#d9d9d9] px-6 pb-24 pt-24 text-[#0a0a0a] sm:px-12">
      <div className="mx-auto w-full max-w-3xl space-y-10 rounded-3xl border border-black/20 bg-[#f0ff5e] p-8">
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
          <p className="text-sm text-black/70">
            This is a provisional privacy policy page. We collect only the data you
            submit through the order form (such as contact details, references, and
            project notes) for the purpose of preparing a proposal and contacting
            you. We do not sell your data. You can request access or deletion at any
            time by contacting us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Terms</h2>
          <p className="text-sm text-black/70">
            This is a provisional terms page. Any project starts after written
            approval of scope, timeline, and pricing. Subscription fees cover
            hosting, maintenance, and agreed updates. Ownership of code remains with
            the studio unless a buyout is agreed in writing.
          </p>
        </section>
      </div>
    </main>
  );
}
