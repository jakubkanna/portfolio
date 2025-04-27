import isMobile from "is-mobile";
import Section from "../Section/Section";
import Typewriter from "../animated/Typewriter/Typewriter";
import MenuButtons from "../Menu/MenuButtons";
import MoveIn from "../animated/MoveIn/MoveIn";

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
        <div className="content">
          {isMobile() ? (
            <MoveIn>
              <MenuButtons />
            </MoveIn>
          ) : (
            <Typewriter />
          )}
        </div>
      </div>
    </Section>
  );
}
