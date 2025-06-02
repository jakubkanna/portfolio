import { useState, useEffect, ReactNode } from "react";

const cursorStyle: React.CSSProperties = {
  borderRight: "0.08em solid black",
  animation: "blink 1s step-end infinite",
};

interface AnimatedTextProps {
  message?: string;
  jsx?: ReactNode;
}

const AnimatedText = ({ message = "", jsx = <></> }: AnimatedTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetText, setTargetText] = useState(message);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (message !== targetText) {
      setIsDeleting(true);
      setTargetText(message);
    }
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

        // Set done state
        const typingComplete = !isDeleting && next === targetText;
        if (typingComplete) {
          setIsDone(true);
        }

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
    <h1 className="typewriter">
      <span
        className="wrap"
        style={cursorStyle}
        dangerouslySetInnerHTML={{ __html: displayedText }}
      />
      {isDone && jsx}
    </h1>
  );
};

export default AnimatedText;
