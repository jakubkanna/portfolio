"use client";

type Detail = { text: string; note?: string };

type OptionCardProps = {
  title: string;
  price?: string;
  showVat?: boolean;
  dots?: string[];
  dotsLabel?: string;
  details?: Detail[];
  disabled?: boolean;
  lockReason?: string;
  badge?: string;
  strikePrice?: boolean;
  isActive: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
};

export default function OptionCard({
  title,
  price,
  showVat = false,
  dots = [],
  dotsLabel,
  details,
  disabled = false,
  lockReason,
  badge,
  strikePrice = false,
  isActive,
  onSelect,
  children,
}: OptionCardProps) {
  const className = `h-full rounded-2xl border p-4 text-left transition ${
    disabled
      ? "cursor-not-allowed border border-black/20 bg-[#f0ff5e] opacity-50"
      : isActive
        ? "border-2 border-black/80 bg-white/5"
        : "border border-black/20 bg-[#f0ff5e] hover:border-black/40"
  }`;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={className}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {dots.length > 0 ? (
              <div className="inline-flex items-center gap-2 text-[10px] tracking-wide text-black/60">
                <span className="group relative inline-flex items-center gap-2">
                  {dots.map((color, index) => (
                    <span
                      key={`${color}-${index}`}
                      className="h-2 w-4 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                  ))}
                  {dotsLabel ? (
                    <span className="pointer-events-none absolute left-1/2 top-5 z-10 w-56 -translate-x-1/2 rounded-lg border border-black/10 bg-black/90 px-3 py-2 text-xs text-white/85 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                      {dotsLabel}
                    </span>
                  ) : null}
                </span>
              </div>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h3 className="min-w-0 text-base font-semibold">{title}</h3>
              {badge ? (
                <span className="rounded-full border border-black/20 px-1 py-0 text-[9px] font-mono uppercase text-black/70">
                  {badge}
                </span>
              ) : null}
              {lockReason ? (
                <span className="group relative inline-flex items-center">
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-black/60 transition group-hover:text-black"
                    tabIndex={0}
                  >
                    ?
                  </span>
                  <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-56 -translate-x-1/2 rounded-lg border border-black/10 bg-black/90 px-3 py-2 text-xs text-white/85 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
                    {lockReason}
                  </span>
                </span>
              ) : null}
            </div>
          </div>
          {price ? (
            <span className="shrink-0 text-right text-xs font-mono text-black/70">
              <span className={`block ${strikePrice ? "line-through" : ""}`}>
                {price}
              </span>
              <span className="block text-[10px] text-black/50">est.</span>
              {showVat ? (
                <span className="block text-[10px] text-black/50">+ VAT</span>
              ) : null}
            </span>
          ) : null}
        </div>
        {details ? (
          <ul className="mt-auto space-y-1 text-sm text-black/70">
            {details.map((detail) => (
              <li key={detail.text} className="flex items-start gap-2">
                <span className="mt-[3px] text-xs">•</span>
                <span className="flex items-center gap-2">
                  {detail.text}
                  {detail.note ? (
                    <span className="group relative inline-flex items-center">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-black/60 transition group-hover:text-black">
                        ?
                      </span>
                      <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-56 -translate-x-1/2 rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-xs text-white/80 opacity-0 shadow-lg transition group-hover:opacity-100">
                        {detail.note}
                      </span>
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        {children ? <div>{children}</div> : null}
      </div>
    </button>
  );
}
