import "./typewriter.css";
import { useEffect, useMemo, useState } from "react";
import AnimatedText from "./AnimatedText";
import Button from "../../Button/Button";
import { applyDarkMode } from "../../../utils/applyDarkMode";

export default function Typewriter() {
  const messages: Messages = useMemo(
    () => [
      {
        text: "Hello World!",
      },
      {
        text: "My name is Jakub.",
      },
      {
        text: "This is my fullstack portfolio.",
      },
      {
        text: "Would you like to use dark colors?",
        prompt: true,
        prompt_id: "dark_colors",
      },
      { text: "Please continue by scrolling down." },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  // next message
  const next = () => {
    setIndex((prev) => prev + 1);
  };

  // interval
  useEffect(() => {
    const current = messages[index];

    const isLast = index === messages.length - 1;
    const shouldPause = current?.prompt || isLast;

    if (shouldPause) return; // Don't set up interval

    const timeout = current.text.length * 200; // 200 milliseconds per letter

    const timer = setInterval(() => next(), timeout);

    return () => clearInterval(timer);
  }, [index, messages]);

  // display
  const Message = () => {
    const message = messages[index];

    // timeout prompt
    useEffect(() => {
      if (!message.prompt) return;
      const timer = setTimeout(() => next(), 10000); //10s
      return () => clearTimeout(timer);
    });

    const handleDarkModeResponse = (response: boolean) => {
      localStorage.setItem("dark_mode", JSON.stringify(response));
      applyDarkMode(response);
      next();
    };

    return (
      <>
        <AnimatedText message={message.text} />
        {message.prompt && (
          <>
            <Button onClick={() => handleDarkModeResponse(true)}>Yes</Button>
            <Button onClick={() => handleDarkModeResponse(false)}>No</Button>
          </>
        )}
      </>
    );
  };

  return <Message />;
}
