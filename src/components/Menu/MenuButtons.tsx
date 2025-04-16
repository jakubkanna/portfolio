import Button from "../Button/Button";
import {
  cvThreshold,
  moreTreshold,
  projectsTreshold,
} from "../sections/thresholds";

export default function MenuButtons() {
  const handleScroll = (threshold: SectionProps["threshold"]) => {
    if (!threshold) return;
    const y = threshold.from * document.body.scrollHeight;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleContact = () => {
    window.open("https://www.jakubkanna.com/contact", "_blank");
  };

  const handleSettings = () => {
    handleScroll({ index: 0, from: 0, to: 0.1 });
    window.open("/#settings", "_self");
  };

  return (
    <>
      {/* sections */}
      <Button onClick={() => handleScroll(cvThreshold)}>CV</Button>
      <Button onClick={() => handleScroll(projectsTreshold)}>Projects</Button>
      <Button onClick={() => handleScroll(moreTreshold)}>More</Button>
      {/* additional */}
      <Button onClick={() => handleContact()}>Contact</Button>{" "}
      <Button onClick={() => handleSettings()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
        </svg>
      </Button>
    </>
  );
}
