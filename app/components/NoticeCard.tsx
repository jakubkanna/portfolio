import type { ReactNode } from "react";

type NoticeCardProps = {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  tone?: "default" | "danger";
};

export default function NoticeCard({
  title,
  children,
  actions,
  tone = "default",
}: NoticeCardProps) {
  const toneStyles =
    tone === "danger"
      ? "border-red-200 bg-[#f7c7c7] text-[#3a0e0e]"
      : "border-black/20 bg-[#f0ff5e] text-black";

  return (
    <div
      className={`rounded-3xl border p-8 text-left shadow-[0_20px_80px_rgba(0,0,0,0.15)] ${toneStyles}`}
    >
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children ? <div className="mt-3 text-sm">{children}</div> : null}
      {actions ? <div className="mt-6">{actions}</div> : null}
    </div>
  );
}
