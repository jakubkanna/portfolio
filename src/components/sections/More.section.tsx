import more from "/docs/more/more.md?raw";
import Markdown from "react-markdown";
import Section from "../Section/Section";
import rehypeRaw from "rehype-raw";
import RehypeVideo from "rehype-video";

export default function MoreSection() {
  return (
    <Section id="CV" title="">
      <Markdown rehypePlugins={[[RehypeVideo, { details: false }], rehypeRaw]}>
        {more}
      </Markdown>
    </Section>
  );
}
