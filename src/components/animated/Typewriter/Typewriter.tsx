import "./typewriter.css";
import { useEffect, useMemo, useState } from "react";
import AnimatedText from "./AnimatedText";
import Button from "../../Button/Button";
import MenuButtons from "../../Menu/MenuButtons";
import { toggleDarkMode } from "../../../utils/toggleDarkMode";

export default function Typewriter() {
  const messages: Messages = useMemo(
    () => [
      {
        text: "Hi, my name is Jakub.",
      },
      {
        text: "Welcome to my full-stack portfolio. 🌸",
        prompt_id: "menu",
      },
      {
        text: "Let's start with how I understand the term of 'full-stack'.",
      },
      {
        text: "In this case 'Fullstack' doesn't mean that I am able to work with frontend and backend only.",
      },
      {
        text: "It's a mindset. 🧠",
      },
      {
        text: "Frontend, backend, 3D, graphic design, sound, bikes 💻🛠️🎨🎧🚴 are just tools I can choose from...",
      },
      {
        text: "To get the job done.",
        prompt_id: "dark_mode",
      },
      { text: "Please continue by scrolling down." },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  //
  const next = () => {
    setIndex((prev) => prev + 1);
    window.location.hash = "";
  };
  const previous = () => {
    setIndex((prev) => prev - 1);
    window.location.hash = "";
  };
  // init
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#settings") {
        setIndex(messages.length - 2);
      }
    };

    handleHashChange(); // Initial check in case hash is already set on load

    window.addEventListener("hashchange", handleHashChange);

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

    const handleDarkModeResponse = () => {
      toggleDarkMode();
      window.location.hash = "";
    };

    // render buttons
    const Buttons = () => {
      if (message.prompt_id == "dark_mode") {
        return (
          <>
            <Button onClick={handleDarkModeResponse}>Switch💥</Button>
          </>
        );
      } else if (message.prompt_id == "menu") {
        return (
          <>
            <div>
              <MenuButtons />
            </div>
          </>
        );
      }
    };

    return (
      <>
        <AnimatedText message={message.text} />
        <Buttons />
        <div>
          {index !== 0 && (
            <Button onClick={previous}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                id="arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                />
              </svg>
            </Button>
          )}
          {index !== messages.length - 1 && (
            <Button onClick={next}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                id="arrow-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                />
              </svg>
            </Button>
          )}
        </div>
      </>
    );
  };

  return <Message />;
}
