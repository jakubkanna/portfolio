"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ModelViewerAttributes = React.HTMLAttributes<HTMLElement> & {
  src?: string;
  "tone-mapping"?: string;
  "shadow-intensity"?: string | number;
  "auto-rotate"?: boolean | string;
  "interaction-prompt"?: string;
  "camera-orbit"?: string;
  bounds?: string;
  style?: React.CSSProperties;
};

type ModelViewerElement = HTMLElement & {
  jumpCameraToGoal?: () => void;
  modelIsVisible?: boolean;
};

const ModelViewer = React.forwardRef<ModelViewerElement, ModelViewerAttributes>(
  (props, ref) =>
    React.createElement("model-viewer", {
      ...props,
      ref,
    } as Record<string, unknown>)
);

ModelViewer.displayName = "ModelViewer";

type ModelViewerButtonProps = {
  href?: string;
  tooltip?: string;
};

export default function Logo({
  href = "/",
  tooltip = "logo",
}: ModelViewerButtonProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const viewerRef = React.useRef<ModelViewerElement | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const intervalRef = React.useRef<number | null>(null);

  React.useEffect(() => setMounted(true), []);

  const markReady = React.useCallback(() => setLoading(false), []);

  const baseY = 90;
  const baseX = 90;
  const radius = "100%";

  React.useEffect(() => {
    if (!viewerRef.current) return;

    const durationMs = 1000;
    const cycleMs = 3000;

    const applyOrbit = (x: number) => {
      const normalizedX = ((x % 360) + 360) % 360;
      const orbit = `${baseY}deg ${normalizedX}deg ${radius}`;
      viewerRef.current?.setAttribute("camera-orbit", orbit);
      viewerRef.current?.jumpCameraToGoal?.();
    };

    const resetOrbit = () => applyOrbit(baseX);

    const spinOnce = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      const start = performance.now();

      const tick = () => {
        const now = performance.now();
        const t = Math.min((now - start) / durationMs, 1);
        const x = baseX + 360 * t;
        applyOrbit(x);

        if (t < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          resetOrbit();
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    resetOrbit();
    intervalRef.current = window.setInterval(spinOnce, cycleMs);
    spinOnce();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mounted, baseX, baseY, radius]);

  React.useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const handleVisibility = (event: Event) => {
      const detail = (event as CustomEvent<{ visible?: boolean }>).detail;
      if (detail?.visible) markReady();
    };

    // If it’s already visible (cached), skip the spinner.
    if (el.modelIsVisible) {
      markReady();
      return;
    }

    el.addEventListener("load", markReady);
    el.addEventListener("model-visibility", handleVisibility);
    const timeout = window.setTimeout(markReady, 3000);
    return () => {
      el.removeEventListener("load", markReady);
      el.removeEventListener("model-visibility", handleVisibility);
      window.clearTimeout(timeout);
    };
  }, [mounted, markReady]);

  if (!mounted) return null;

  const isLightPage = pathname === "/about" || pathname === "/contact";
  const textClass = isLightPage ? "text-[#0a0a0a]" : "text-foreground";

  const content = (
    <div
      className={`inline-flex items-center justify-center overflow-hidden rounded-full ${textClass}`}
    >
      {loading && (
        <span className="text-sm font-medium tracking-wide">STUDIO JKN</span>
      )}
      <ModelViewer
        id="model-button"
        src="/jkn-logo.glb"
        tone-mapping="neutral"
        shadow-intensity="0"
        interaction-prompt="none"
        camera-orbit={`${baseY}deg ${baseX}deg ${radius}`}
        bounds="tight"
        className={`block h-28 w-28 ${loading ? "hidden" : ""}`.trim()}
        style={{
          background: "transparent",
        }}
        ref={viewerRef}
        onLoad={markReady}
        suppressHydrationWarning
      />
    </div>
  );

  return (
    <Link
      href={href}
      className="fixed top-6 left-6 z-20 inline-flex no-underline"
      aria-label={tooltip}
      style={{ height: 23, width: 120 }}
    >
      {content}
    </Link>
  );
}
