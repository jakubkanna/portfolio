import React, { useState, useEffect } from "react";

// Define the props interface
interface AsciiLoaderProps {
  className?: string;
}

const AsciiLoader: React.FC<AsciiLoaderProps> = ({ className }) => {
  // Define the loader frames
  const frames: string[] = ["|", "\\", "--", "/"];

  // State to track the current frame, initialized to 0
  const [currentFrame, setCurrentFrame] = useState<number>(0);

  // State to control whether the loader should be visible

  // Effect to handle the interval logic for the loader frames
  useEffect(() => {
    // Only set up the interval if the loader is visible
    const intervalId = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % frames.length);
    }, 140); // Change frame every 140ms

    // Cleanup interval on component unmount or when loader visibility changes
    return () => clearInterval(intervalId);
  }, [frames.length]);

  return (
    <span
      className={className}
      style={{
        fontSize: "2rem",
        fontFamily: "monospace",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {frames[currentFrame]}
    </span>
  );
};

export default AsciiLoader;
