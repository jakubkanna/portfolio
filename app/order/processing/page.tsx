"use client";

import { useRouter } from "next/navigation";
import NoticeCard from "../../components/NoticeCard";

export default function OrderProcessingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#d9d9d9] px-6 pb-28 pt-24 text-[#0a0a0a] sm:px-12">
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
        <NoticeCard
          title="Order submitted"
          actions={
            <button
              type="button"
              onClick={() => router.replace("/")}
              className="rounded-full border border-black/30 px-4 py-2 text-xs text-black/70"
            >
              Back to home page
            </button>
          }
        >
          <p>We will contact you by email with next steps.</p>
        </NoticeCard>
      </div>
    </main>
  );
}
