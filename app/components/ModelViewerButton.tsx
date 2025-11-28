"use client";

import React from "react";
import Link from "next/link";

type ModelViewerAttributes = React.HTMLAttributes<HTMLElement> & {
  src?: string;
  "tone-mapping"?: string;
  "shadow-intensity"?: string | number;
  "auto-rotate"?: boolean | string;
  "interaction-prompt"?: string;
  "camera-orbit"?: string;
  style?: React.CSSProperties;
};

const ModelViewer = (props: ModelViewerAttributes) =>
  React.createElement("model-viewer", props as Record<string, unknown>);

type ModelViewerButtonProps = {
  href?: string;
  tooltip?: string;
};

export default function ModelViewerButton({
  href = "/",
  tooltip = "logo",
}: ModelViewerButtonProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const content = (
    <div className="inline-flex items-center justify-center">
      <ModelViewer
        id="model-button"
        src="/jkn-logo.glb"
        tone-mapping="neutral"
        shadow-intensity="0"
        auto-rotate
        interaction-prompt="none"
        camera-orbit="90deg"
        style={{
          height: "140px",
          width: "135px",
          display: "block",
        }}
        suppressHydrationWarning
      />
    </div>
  );

  return (
    <Link href={href} className="fixed bottom-6 right-6 z-20 inline-flex" aria-label={tooltip}>
      {content}
    </Link>
  );
}
