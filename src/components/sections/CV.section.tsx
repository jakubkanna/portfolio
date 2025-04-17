import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import Section from "../Section/Section";
import rehypeRaw from "rehype-raw";
import RehypeVideo from "rehype-video";
import isMobile from "is-mobile";
import remarkGfm from "remark-gfm";
import Button from "../Button/Button";

export default function CVSection({
  containerYProgress,
  threshold,
}: SectionProps) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Dynamically import the more.md file
    const markdownFiles = import.meta.glob("/docs/cv/*.md", { as: "raw" });

    const loadFile = async () => {
      const filePath = Object.keys(markdownFiles)[0];
      if (filePath) {
        const raw = await markdownFiles[filePath]();
        setContent(raw);
      }
    };

    loadFile();
  }, []);

  return (
    <Section
      id="CV"
      title="CV"
      containerYProgress={containerYProgress}
      threshold={threshold}
      label="cv"
    >
      <div className="container">
        {isMobile() ? (
          <Button>Send the CV directly to your inbox</Button>
        ) : (
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[RehypeVideo, { details: false }], rehypeRaw]}
          >
            {content}
          </Markdown>
        )}
      </div>
    </Section>
  );
}
