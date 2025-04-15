import contact from "/docs/contact/contact.md?raw";
import Markdown from "react-markdown";
import Section from "../Section/Section";

export default function ContactSection() {
  return (
    <Section id="Contact" title="Contact" containerYProgress={undefined}>
      <Markdown>{contact}</Markdown>
    </Section>
  );
}
