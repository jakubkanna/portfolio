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

export default function ScrollSequence({
  containerYProgress,
  threshold,
}: ScrollSequenceProps) {
  const frameCount = 396;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [format, setFormat] = useState<"webp" | "jpg">();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
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
        if (index === 0) return resolve(); // Already loaded
        const preloadImg = new Image();
        preloadImg.src = getFrameSrc(index);
        preloadImg.onload = () => resolve();
      });
    };

    const loadAllImages = async () => {
      document.body.style.overflow = "hidden";
      const loadPromises = [];
      for (let i = 0; i < frameCount; i += 4) {
        loadPromises.push(loadImage(i));
      }
      await Promise.all(loadPromises);
      document.body.style.overflow = "";
      setIsLoadingComplete(true);
    };

    loadAllImages();
  }, [format, getFrameSrc]);

  useEffect(() => console.log(isLoadingComplete), [isLoadingComplete]);
  // Frame update on scroll
  useMotionValueEvent(containerYProgress, "change", (rawProgress) => {
    if (!threshold) return;

    const { from, to } = threshold;
    const clamped = Math.min(Math.max(rawProgress, from), to);
    const progress = (clamped - from) / (to - from);

    setScrollProgress(progress); //set state for progress bar

    let frameIndex = Math.round(progress * (frameCount - 1)); // 0.125 * (410 -1), -1 because we start from 0
    frameIndex = frameIndex - (frameIndex % 4); //skip every 4th

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const img = imgRef.current;

    if (!canvas || !context || !img) return;

    const newSrc = getFrameSrc(frameIndex);
    const currentSrc = new URL(img.src, window.location.href).pathname;

    if (currentSrc !== newSrc) {
      //check if the source has changed, in case it's e.g. 0000
      img.src = newSrc;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
        context.drawImage(img, 0, 0);
      };
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
