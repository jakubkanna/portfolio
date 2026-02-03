import NoticeCard from "../../components/NoticeCard";

export default function OrderFailPage() {
  return (
    <main className="min-h-screen bg-[#d9d9d9] px-6 pb-28 pt-24 text-[#0a0a0a] sm:px-12">
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
        <NoticeCard title="Payment failed" tone="danger">
          <p>Something went wrong. Please contact us for help.</p>
        </NoticeCard>
      </div>
    </main>
  );
}
