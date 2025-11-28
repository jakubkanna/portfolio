"use client";

type ButtonProps = {
  label: string;
  variant?: "outline" | "background" | "link";
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
    "rounded-full px-6 py-3 text-sm font-medium tracking-normal transition cursor-pointer";

  const variantClass =
    variant === "background"
      ? "bg-foreground text-black uppercase hover:bg-foreground/90"
      : variant === "link"
      ? "rounded-none border-none bg-transparent px-0 py-0 text-foreground underline hover:text-white"
      : "border border-foreground text-foreground uppercase hover:bg-white/10";

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
