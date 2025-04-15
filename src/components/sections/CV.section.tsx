import cv from "/docs/cv/cv.md?raw";
import Markdown from "react-markdown";
import Section from "../Section/Section";
import remarkGfm from "remark-gfm";

export default function CVSection({
  containerYProgress,
  threshold,
}: SectionProps) {
  return (
    <Section
      id="CV"
      title="CV"
      containerYProgress={containerYProgress}
      threshold={threshold}
    >
      <div className="container">
        <Markdown remarkPlugins={[remarkGfm]}>{cv}</Markdown>
      </div>
    </Section>
  );
}
