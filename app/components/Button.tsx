"use client";

type ButtonProps = {
  label: React.ReactNode;
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
    "rounded-full px-2 py-2 md:py-0 text-sm tracking-normal transition cursor-pointer text-center";

  const variantClass =
    variant === "background"
      ? "bg-foreground text-black uppercase hover:bg-foreground/90"
      : variant === "link"
        ? "rounded-none border-none bg-transparent px-0 py-0 text-current hover:opacity-80"
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
