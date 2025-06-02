import { useRef, useEffect } from "react";
import "./sequence.css";
import { MotionValue } from "motion";

interface ScrollSequenceProps {
  frameCount: number;
  containerYProgress: MotionValue;
  threshold: SectionProps["threshold"];
}

export default function ScrollSequence({
  frameCount = 410,
  containerYProgress,
  threshold,
}: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null); // persist single image

  const onClick = () => {
    window.location.href = "mailto:hello.jakubkanna@gmail.com";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context)
      return console.error("Canvas or context not found");

    const currentFrame = (index: number) =>
      `/sequence/${index.toString().padStart(4, "0")}.jpg`;

    // Create and load first image
    const img = new Image();
    img.src = currentFrame(0);
    img.onload = () => {
      context.drawImage(img, 0, 0);
    };
    imgRef.current = img;

    // Preload images
    const preloadImages = () => {
      for (let i = 0; i < frameCount; i++) {
        const image = new Image();
        image.src = currentFrame(i);
      }
    };

    preloadImages();
  }, [frameCount]);

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const img = imgRef.current;

      if (!canvas || !context || !img || !threshold) return;

      const { from, to } = threshold;
      const rawProgress = containerYProgress.get();
      const clampedProgress = Math.min(Math.max(rawProgress, from), to);
      const normalizedProgress = (clampedProgress - from) / (to - from);

      const frameIndex = Math.round(normalizedProgress * (frameCount - 1));

      const newSrc = `/sequence/${frameIndex.toString().padStart(4, "0")}.jpg`;
      if (img.src !== newSrc) {
        img.src = newSrc;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.clearRect(0, 0, canvas.width, canvas.height);
          const x = (canvas.width - img.width) / 2;
          const y = (canvas.height - img.height) / 2;
          context.drawImage(img, x, y);
        };
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [containerYProgress, frameCount, threshold]);

  return (
    <canvas
      className="sequenceCanvas"
      id="Canvas"
      ref={canvasRef}
      onClick={onClick}
    />
  );
}
