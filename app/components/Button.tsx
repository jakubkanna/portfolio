"use client";

type ButtonProps = {
  label: string;
  variant?: "outline" | "background";
  action?: () => void;
  className?: string;
};

export default function Button({
  label,
  variant = "outline",
  action,
  className = "",
}: ButtonProps) {
  const base =
    "rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition";

  const variantClass =
    variant === "background"
      ? "bg-foreground text-black hover:bg-foreground/90"
      : "border border-foreground text-foreground hover:bg-white/10";

  return (
    <button
      type="button"
      onClick={action}
      className={`${base} ${variantClass} ${className}`.trim()}
    >
      {label}
    </button>
  );
}
