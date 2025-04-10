import more from "/docs/more/more.md?raw";
import Markdown from "react-markdown";
import Section from "../Section/Section";

export default function MoreSection() {
  return (
    <Section id="CV" title="">
      <Markdown>{more}</Markdown>
    </Section>
  );
}
