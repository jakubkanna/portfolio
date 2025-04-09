import cv from "/docs/cv/cv.md?raw";
import Markdown from "react-markdown";
import Section from "../Section/Section";
import remarkGfm from "remark-gfm";

export default function CVSection() {
  return (
    <Section id="CV" title="CV">
      <Markdown remarkPlugins={[remarkGfm]}>{cv}</Markdown>
    </Section>
  );
}
