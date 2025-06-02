import { useState, useEffect } from "react";

const cursorStyle: React.CSSProperties = {
  borderRight: "0.08em solid black",
  animation: "blink 1s step-end infinite",
};

const AnimatedText = ({ message = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetText, setTargetText] = useState(message || "");

  // Update state if message prop changes
  useEffect(() => {
    if (message !== targetText) {
      setIsDeleting(true);
      setTargetText(message || "");
    }
  }, [message, targetText]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const getNextChunk = (str: string, pos: number) => {
      if (pos >= str.length) return "";
      if (str[pos] !== "<") return str[pos]; // Normal char

      // Full tag chunk
      const end = str.indexOf(">", pos);
      if (end === -1) return ""; // malformed tag
      return str.slice(pos, end + 1);
    };

    const tick = () => {
      const fullText = targetText || "";

      setDisplayedText((prev = "") => {
        if (isDeleting) {
          const next = prev.slice(0, -1);
          if (next === "") setIsDeleting(false);
          return next;
        } else {
          const nextChunk = getNextChunk(fullText, prev.length);
          return fullText.substring(0, prev.length + nextChunk.length);
        }
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
    <h1 className="typewrite">
      <span
        className="wrap"
        style={cursorStyle}
        dangerouslySetInnerHTML={{ __html: displayedText }}
      />
    </h1>
  );
};

export default AnimatedText;
