"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MotionValue } from "motion";
import { useMotionValueEvent } from "motion/react";
import supportsWebP from "supports-webp";
import isMobile from "is-mobile";
import ProgressBar from "./ProgressBar";
import Loader from "./Loader";
import { useRouter } from "next/navigation";

type ScrollSequenceProps = {
  scrollProgress: MotionValue<number>;
};

const frameCount = 55;
const step = 1;
const imageCache: Record<string, HTMLImageElement> = {};

export default function ScrollSequence({
  scrollProgress,
}: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const router = useRouter();
  const [format, setFormat] = useState<"webp" | "jpg">();
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    (async () => {
      const supported = await supportsWebP;
      setFormat(supported ? "webp" : "jpg");
    })();
  }, []);

  const getFrameSrc = useCallback(
    (index: number) =>
      `/sequence/${index.toString().padStart(4, "0")}.${format}`,
    [format]
  );

  useEffect(() => {
    if (!format) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const first = new Image();
    first.src = getFrameSrc(0);
    first.onload = () => {
      canvas.width = first.width;
      canvas.height = first.height;
      ctx.drawImage(first, 0, 0);
      imgRef.current = first;
    };

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const src = getFrameSrc(index);
        if (imageCache[src]) return resolve();

        const preload = new Image();
        preload.src = src;
        preload.onload = () => {
          imageCache[src] = preload;
          resolve();
        };
      });
    };

    const loadAll = async () => {
      document.body.style.overflow = "hidden";
      const jobs = [];
      for (let i = 0; i < frameCount; i += step) {
        jobs.push(loadImage(i));
      }
      await Promise.all(jobs);
      document.body.style.overflow = "";
      setIsReady(true);
    };

    loadAll();
  }, [format, getFrameSrc]);

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    const clamped = Math.min(Math.max(latest, 0), 1);
    setProgress(clamped);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !format) return;

    let frameIndex = Math.round(clamped * (frameCount - 1));
    frameIndex = frameIndex - (frameIndex % step);

    const img = imageCache[getFrameSrc(frameIndex)] || imgRef.current;
    if (img) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    }
  });

  useEffect(() => {
    if (!hasNavigated && progress >= 0.999) {
      setHasNavigated(true);
      router.push("/about");
    }
  }, [hasNavigated, progress, router]);

  return (
    <div className="relative h-screen w-screen bg-black">
      {!isReady && <Loader />}
      <ProgressBar progress={progress} />
      <canvas
        ref={canvasRef}
        className="h-screen w-screen object-cover"
        aria-label="Scroll-driven image sequence"
      />
      {!isMobile() && (
        <span
          className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 font-mono text-xs text-foreground/70"
          style={{ opacity: 1 - progress }}
        >
          Designing and developing unique digital experiences since 2018.
        </span>
      )}
    </div>
  );
}
