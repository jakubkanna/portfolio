import Section from "../Section/Section";
import Typewriter from "../animated/Typewriter/Typewriter";

export default function HelloSection({
  containerYProgress,
  threshold,
}: SectionProps) {
  return (
    <Section
      id="Hello"
      title=""
      containerYProgress={containerYProgress}
      threshold={threshold}
      label="Hello"
    >
      <div className="container">
        <Typewriter />
      </div>
    </Section>
  );
}
