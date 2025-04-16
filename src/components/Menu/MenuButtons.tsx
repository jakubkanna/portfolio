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
      <Button onClick={() => handleSettings()}>Settings</Button>
    </>
  );
}
