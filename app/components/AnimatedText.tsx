"use client";

import { CSSProperties, ReactNode, useEffect, useState } from "react";

type AnimatedTextProps = {
  message?: string;
  after?: ReactNode;
};

const cursorStyle: CSSProperties = {
  borderRight: "0.08em solid #e6e6e6",
  animation: "blink 1s step-end infinite",
};

export default function AnimatedText({
  message = "",
  after = null,
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetText, setTargetText] = useState(message);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (message === targetText) return;

    const id = requestAnimationFrame(() => {
      setIsDeleting(true);
      setIsDone(false);
      setTargetText(message);
    });

    return () => cancelAnimationFrame(id);
  }, [message, targetText]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const getNextChunk = (str: string, pos: number) => {
      if (pos >= str.length) return "";
      if (str[pos] !== "<") return str[pos];
      const end = str.indexOf(">", pos);
      if (end === -1) return "";
      return str.slice(pos, end + 1);
    };

    const tick = () => {
      const fullText = targetText;

      setDisplayedText((prev = "") => {
        let next = prev;

        if (isDeleting) {
          next = prev.slice(0, -1);
          if (next === "") setIsDeleting(false);
        } else {
          const nextChunk = getNextChunk(fullText, prev.length);
          next = fullText.substring(0, prev.length + nextChunk.length);
        }

        const typingComplete = !isDeleting && next === targetText;
        if (typingComplete) setIsDone(true);

        return next;
      });

      const doneTyping = !isDeleting && displayedText === targetText;
      const doneDeleting = isDeleting && displayedText === "";

      let delay = 40;
      if (isDeleting) delay = 20;
      if (doneTyping) delay = 1200;
      if (doneDeleting) delay = 200;

      timeout = setTimeout(tick, delay);
    };

    timeout = setTimeout(tick, 100);
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, targetText]);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold uppercase leading-tight sm:text-6xl">
        <span
          className="inline-block"
          style={cursorStyle}
          dangerouslySetInnerHTML={{ __html: displayedText }}
        />
      </h1>
      {isDone && after}
    </div>
  );
}
