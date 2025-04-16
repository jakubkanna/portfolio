import { useState, useEffect } from "react";

const cursorStyle: React.CSSProperties = {
  borderRight: "0.08em solid black",
  animation: "blink 1s step-end infinite",
};

const AnimatedText = ({ message = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetText, setTargetText] = useState(message); // Current goal

  useEffect(() => {
    // If the message prop changes, trigger deletion first
    if (message !== targetText) {
      setIsDeleting(true);
      setTargetText(message);
    }
  }, [message, targetText]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const fullText = targetText;

      setDisplayedText((prev) => {
        if (isDeleting) {
          const next = prev.slice(0, -1);
          if (next === "") {
            setIsDeleting(false); // Once deleted, start typing
          }
          return next;
        } else {
          const next = fullText.substring(0, prev.length + 1);
          return next;
        }
      });

      const doneTyping = !isDeleting && displayedText === fullText;
      const doneDeleting = isDeleting && displayedText === "";

      let delay = 200 - Math.random() * 100;
      if (isDeleting) delay /= 2;
      if (doneTyping) delay = 1000;
      if (doneDeleting) delay = 200;

      timeout = setTimeout(tick, delay);
    };

    timeout = setTimeout(tick, 100);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, targetText]);

  return (
    <h1 className="typewrite">
      <span className="wrap" style={cursorStyle}>
        {displayedText}
      </span>
    </h1>
  );
};

export default AnimatedText;
