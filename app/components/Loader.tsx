"use client";

import { useEffect, useState } from "react";

const frames = ["|", "\\", "--", "/"];

export default function Loader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % frames.length),
      140
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-4xl font-mono absolute inset-0 grid place-items-center">
      {frames[index]}
    </span>
  );
}
