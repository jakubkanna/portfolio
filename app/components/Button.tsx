"use client";

type ButtonProps = {
  label: React.ReactNode;
  variant?: "outline" | "background" | "link" | "light";
  action?: () => void;
  className?: string;
  size?: "md" | "lg";
};

export default function Button({
  label,
  variant = "outline",
  action,
  className = "",
  size = "md",
}: ButtonProps) {
  const base =
    "rounded-full text-sm tracking-normal transition cursor-pointer text-center";
  const sizeClass =
    size === "lg" ? "px-6 py-3" : "px-2 py-2 md:py-0";

  const variantClass =
    variant === "background"
      ? "bg-foreground text-black uppercase hover:bg-foreground/90"
      : variant === "light"
        ? "bg-white/90 text-black uppercase hover:bg-white/80"
      : variant === "link"
        ? "rounded-none border-none bg-transparent px-0 py-0 text-current hover:opacity-80"
        : "border border-foreground text-foreground uppercase hover:bg-white/10";

  return (
    <button
      type="button"
      onClick={action}
      className={`${base} ${sizeClass} ${variantClass} ${className}`.trim()}
    >
      {label}
    </button>
  );
}
