import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import Section from "../Section/Section";
import rehypeRaw from "rehype-raw";
import RehypeVideo from "rehype-video";

export default function MoreSection({
  containerYProgress,
  threshold,
}: SectionProps) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Dynamically import the more.md file
    const markdownFiles = import.meta.glob("/docs/more/*.md", { as: "raw" });

    const loadFile = async () => {
      const filePath = Object.keys(markdownFiles)[0];
      if (filePath) {
        const raw = await markdownFiles[filePath]();
        setContent(raw);
      }
    };

    loadFile();
  }, []);

  useEffect(
    () => console.log(containerYProgress, threshold),
    [containerYProgress, threshold]
  );

  return (
    <Section
      id="More"
      title=""
      containerYProgress={containerYProgress}
      threshold={threshold}
    >
      <Markdown rehypePlugins={[[RehypeVideo, { details: false }], rehypeRaw]}>
        {content}
      </Markdown>
    </Section>
  );
}
