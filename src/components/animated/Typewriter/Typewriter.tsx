import "./typewriter.css";
import { useEffect, useMemo, useState } from "react";
import AnimatedText from "./AnimatedText";
import Button from "../../Button/Button";
import { applyDarkMode } from "../../../utils/applyDarkMode";
import MenuButtons from "../../Menu/MenuButtons";

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
        text: "Here are some shortcuts:",
        prompt_id: "menu",
      },
      {
        text: "Would you like to use dark colors?",
        prompt_id: "dark_mode",
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

  // init
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#settings") {
        setIndex(messages.length - 2);
      }
    };

    // Initial check in case hash is already set on load
    handleHashChange();

    // Add event listener
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [messages.length]);

  // interval
  useEffect(() => {
    const current = messages[index];

    const isLast = index === messages.length - 1;
    const shouldPause = current?.prompt_id || isLast;

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
      if (!message.prompt_id) return;
      const timer = setTimeout(() => next(), 30000); //10s
      return () => clearTimeout(timer);
    });

    const handleDarkModeResponse = (response: boolean) => {
      localStorage.setItem("dark_mode", JSON.stringify(response));
      applyDarkMode(response);
      next();
    };

    // render buttons
    const Buttons = () => {
      if (message.prompt_id == "dark_mode") {
        return (
          <>
            <Button onClick={() => handleDarkModeResponse(true)}>Yes</Button>
            <Button onClick={() => handleDarkModeResponse(false)}>No</Button>
          </>
        );
      } else if (message.prompt_id == "menu") {
        return (
          <div>
            <MenuButtons />

            <Button
              onClick={() => {
                setIndex(messages.length - 1);
              }}
            >
              Skip
            </Button>
          </div>
        );
      }
    };

    return (
      <>
        <AnimatedText message={message.text} />
        <Buttons />
      </>
    );
  };

  return <Message />;
}
