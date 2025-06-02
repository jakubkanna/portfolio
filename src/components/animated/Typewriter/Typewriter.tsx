import "./typewriter.css";
import { useEffect, useMemo, useState } from "react";
import AnimatedText from "./AnimatedText";
import Button from "../../Button/Button";
import MenuButtons from "../../Menu/MenuButtons";
import { toggleDarkMode } from "../../../utils/toggleDarkMode";

export default function Typewriter() {
  const messages = useMemo(
    () => [{ text: "Hello.", prompt_id: "" }, { text: "Welcome." }],
    []
  );
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => prev + 1);
  const previous = () => setIndex((prev) => prev - 1);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#settings") {
        setIndex(messages.length - 2);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [messages.length]);

  useEffect(() => {
    const current = messages[index];
    const isLast = index === messages.length - 1;
    const shouldPause = current?.prompt_id || isLast;

    if (shouldPause) return;

    const timer = setTimeout(() => next(), current.text.length * 200);
    return () => clearTimeout(timer);
  }, [index, messages]);

  const message = messages[index];

  useEffect(() => {
    if (!message.prompt_id) return;
    const timer = setTimeout(() => next(), 30000);
    return () => clearTimeout(timer);
  }, [message]);

  const renderButtons = () => {
    switch (message.prompt_id) {
      case "dark_mode":
        return <Button onClick={toggleDarkMode}>Switch💥</Button>;
      case "menu":
        return <MenuButtons />;
      default:
        return null;
    }
  };

  return (
    <>
      <AnimatedText message={message.text} />
      {renderButtons()}
      <div>
        {index > 0 && (
          <Button onClick={previous}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
              />
            </svg>
          </Button>
        )}
        {index < messages.length - 1 && (
          <Button onClick={next}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
              />
            </svg>
          </Button>
        )}
      </div>
    </>
  );
}
