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

type ModelViewerButtonProps = {};

export default function ModelViewerButton({}: ModelViewerButtonProps) {
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
      />
    </div>
  );

  return (
    <Link
      href={"/"}
      className="fixed bottom-6 right-6 z-20 inline-flex"
      aria-label="logo"
    >
      {content}
    </Link>
  );
}
