import Section from "../Section/Section";

export default function LogoSection({
  containerYProgress,
  threshold,
}: SectionProps) {
  const style: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "32px",
    height: "auto",
    margin: "0",
  };
  return (
    <Section
      id="Logo"
      containerYProgress={containerYProgress}
      threshold={threshold}
    >
      <img src="./favicon/android-chrome-512x512.png" style={style}></img>
    </Section>
  );
}
