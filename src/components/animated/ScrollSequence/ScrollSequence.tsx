import { useRef, useEffect, useState, useCallback } from "react";
import "./sequence.css";
import { MotionValue } from "motion";
import supportsWebP from "supports-webp";
import Progress from "../../Progress/Progress";
import { useMotionValueEvent } from "motion/react";

interface ScrollSequenceProps {
  containerYProgress: MotionValue;
  threshold: SectionProps["threshold"];
}

export default function ScrollSequence({
  containerYProgress,
  threshold,
}: ScrollSequenceProps) {
  const frameCount = 410;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [format, setFormat] = useState<"webp" | "jpg" | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const onClick = () => {
    window.location.href = "mailto:hello.jakubkanna@gmail.com";
  };

  // Detect WebP support once
  useEffect(() => {
    async function checkWebPSupport() {
      const isSupported = await supportsWebP;
      if (isSupported) {
        setFormat("webp");
      } else {
        setFormat("jpg");
      }
    }
    checkWebPSupport();
  }, []);

  // Get frame source path
  const getFrameSrc = useCallback(
    (index: number) =>
      `/sequence/${index.toString().padStart(4, "0")}.${format}`,
    [format]
  );

  // Initial image and preload
  useEffect(() => {
    if (!format) return; // wait for format detection

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context)
      return console.error("Canvas or context not found");

    const img = new Image();
    img.src = getFrameSrc(0);
    img.onload = () => context.drawImage(img, 0, 0);
    imgRef.current = img;

    // Preload
    for (let i = 0; i < frameCount; i += 4) {
      // skip every 4th
      const preloadImg = new Image();
      preloadImg.src = getFrameSrc(i);
    }
  }, [frameCount, format, getFrameSrc]);

  // Frame update on scroll
  useMotionValueEvent(containerYProgress, "change", (rawProgress) => {
    if (!threshold) return;

    const { from, to } = threshold;
    const clamped = Math.min(Math.max(rawProgress, from), to);
    const progress = (clamped - from) / (to - from);

    setScrollProgress(progress);

    let frameIndex = Math.round(progress * (frameCount - 1));
    frameIndex = frameIndex - (frameIndex % 4); //skip every 4th

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const img = imgRef.current;

    if (!canvas || !context || !img) return;

    const newSrc = getFrameSrc(frameIndex);
    const currentSrc = new URL(img.src, window.location.href).pathname;

    if (currentSrc !== newSrc) {
      img.src = newSrc;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
    }
  });

  return (
    <>
      <Progress progress={scrollProgress} />
      <canvas
        className="sequenceCanvas"
        id="Canvas"
        ref={canvasRef}
        onClick={onClick}
      />
    </>
  );
}
