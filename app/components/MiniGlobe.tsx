"use client";

import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";

const frameCount = 30;
const frameSources = Array.from({ length: frameCount }, (_, index) => {
  return `/globe-mini/${index.toString().padStart(4, "0")}.png`;
});
const frameCache: Record<string, HTMLImageElement> = {};
let preloadPromise: Promise<void> | null = null;

const preloadFrames = () => {
  if (preloadPromise) return preloadPromise;

  preloadPromise = Promise.all(
    frameSources.map(
      (src) =>
        new Promise<void>((resolve) => {
          if (frameCache[src]) {
            resolve();
            return;
          }
          const img = new Image();
          img.src = src;
          img.onload = () => {
            frameCache[src] = img;
            resolve();
          };
          img.onerror = () => resolve();
        }),
    ),
  ).then(() => undefined);

  return preloadPromise;
};

export default function MiniGlobe({ className = "" }: { className?: string }) {
  const [frame, setFrame] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let mounted = true;
    void preloadFrames().then(() => {
      if (mounted) setIsReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const id = setInterval(
      () => setFrame((prev) => (prev + 1) % frameCount),
      80,
    );
    return () => clearInterval(id);
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;
    const src = frameSources[frame];
    const img = src ? frameCache[src] : null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!img || !canvas || !ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, [frame, isReady]);

  return (
    <div
      className={`relative flex h-28 w-28 items-center justify-center ${className}`}
    >
      {!isReady && <Loader />}
      <canvas
        ref={canvasRef}
        className={`h-full w-full object-contain transition-opacity duration-200 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
