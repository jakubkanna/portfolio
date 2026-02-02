"use client";

import { useEffect, useMemo, useState } from "react";
import Loader from "./Loader";

const frameCount = 30;

export default function MiniGlobe({ className = "" }: { className?: string }) {
  const [frame, setFrame] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const frames = useMemo(
    () =>
      Array.from({ length: frameCount }, (_, index) => {
        return `/globe-mini/${index.toString().padStart(4, "0")}.png`;
      }),
    [],
  );

  useEffect(() => {
    let mounted = true;
    const preload = async () => {
      const jobs = frames.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      );
      await Promise.all(jobs);
      if (mounted) setIsReady(true);
    };
    preload();
    return () => {
      mounted = false;
    };
  }, [frames]);

  useEffect(() => {
    if (!isReady) return;
    const id = setInterval(
      () => setFrame((prev) => (prev + 1) % frameCount),
      80,
    );
    return () => clearInterval(id);
  }, [isReady]);

  return (
    <div
      className={`relative flex h-28 w-28 items-center justify-center ${className}`}
    >
      {!isReady && <Loader />}
      {frames[frame] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={frames[frame]}
          alt=""
          className={`h-full w-full object-contain transition-opacity duration-200 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
          loading="eager"
        />
      ) : null}
    </div>
  );
}
