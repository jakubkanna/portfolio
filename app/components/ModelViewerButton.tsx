"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  href,
  tooltip = "3D logo",
}: ModelViewerButtonProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowTooltip(false), 2200);
    return () => clearTimeout(timeout);
  }, []);

  const content = (
    <div className="relative flex flex-col items-end">
      {showTooltip && (
        <div className="mb-2 rounded bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-black shadow-sm">
          {tooltip}
        </div>
      )}
      <div
        className="cursor-pointer "
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <ModelViewer
          id="model-button"
          src="/jk-logo.glb"
          tone-mapping="neutral"
          shadow-intensity="0"
          auto-rotate
          interaction-prompt="none"
          camera-orbit="90deg"
          style={{ height: "90px", width: "120px" }}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="fixed bottom-6 right-6 z-20"
        aria-label={tooltip}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-20" aria-label={tooltip}>
      {content}
    </div>
  );
}
