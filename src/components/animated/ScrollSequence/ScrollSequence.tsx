import { useRef, useEffect, useState, useCallback } from "react";
import "./sequence.css";
import { MotionValue } from "motion";
import supportsWebP from "supports-webp";
import Progress from "../../Progress/Progress";
import { useMotionValueEvent } from "motion/react";
import Loader from "../Loader/Loader";

interface ScrollSequenceProps {
  containerYProgress: MotionValue;
  threshold: SectionProps["threshold"];
}

// Store preloaded images in memory to avoid reloading
const imageCache: { [src: string]: HTMLImageElement } = {};

export default function ScrollSequence({
  containerYProgress,
  threshold,
}: ScrollSequenceProps) {
  const frameCount = 396;
  const step = 4; // Skip every 4th frame for performance
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [format, setFormat] = useState<"webp" | "jpg">();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  // Detect WebP support
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
    if (!format) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // Load and draw the very first frame
    const img = new Image();
    img.src = getFrameSrc(0);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      imgRef.current = img;
    };

    // Preload the rest in the background
    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const src = getFrameSrc(index);
        if (imageCache[src]) return resolve(); // Already cached

        const preloadImg = new Image();
        preloadImg.src = src;
        preloadImg.onload = () => {
          imageCache[src] = preloadImg; // Save to cache
          resolve();
        };
      });
    };

    const loadAllImages = async () => {
      document.body.style.overflow = "hidden";
      const loadPromises = [];
      for (let i = 0; i < frameCount; i += step) {
        loadPromises.push(loadImage(i));
      }
      await Promise.all(loadPromises);
      document.body.style.overflow = "";
      setIsLoadingComplete(true);
    };

    loadAllImages();
  }, [format, getFrameSrc]);

  // Frame update on scroll
  useMotionValueEvent(containerYProgress, "change", (rawProgress) => {
    if (!threshold) return;

    const { from, to } = threshold;
    const clamped = Math.min(Math.max(rawProgress, from), to);
    const progress = (clamped - from) / (to - from);

    setScrollProgress(progress); //set state for progress bar

    let frameIndex = Math.round(progress * (frameCount - 1)); // 0.125 * (410 -1), -1 because we start from 0
    frameIndex = frameIndex - (frameIndex % step);

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const img = imageCache[getFrameSrc(frameIndex)] || imgRef.current;

    if (canvas && context && img) {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
    }
  });

  return (
    <>
      {!isLoadingComplete && <Loader />}

      <>
        <Progress progress={scrollProgress} />
        <canvas className="sequenceCanvas" id="Canvas" ref={canvasRef} />
      </>
    </>
  );
}
