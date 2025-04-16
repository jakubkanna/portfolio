import Markdown from "react-markdown";
import Section from "../../Section/Section";
import { useEffect, useState } from "react";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function SingleSection({
  containerYProgress,
  threshold,
  label,
  className,
  title,
}: SectionProps) {
  const [content, setContent] = useState<string | null>(null);
  const markdownFiles = import.meta.glob("/docs/*/*.md", { as: "raw" });

  useEffect(() => {
    const loadFile = async () => {
      const fileEntry = Object.entries(markdownFiles).find(([path]) =>
        path.includes(`/docs/${label.toLowerCase()}/`)
      );

      if (fileEntry) {
        const [, importFn] = fileEntry;
        const raw = await importFn();
        setContent(raw);
      }
    };

    loadFile();
  }, [label, markdownFiles]);

  return (
    <Section
      id={label}
      title={title || label}
      containerYProgress={containerYProgress}
      threshold={threshold}
      label={label}
      className={className}
    >
      <div className="container">
        {content && (
          <>
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {content}
            </Markdown>
          </>
        )}
      </div>
    </Section>
  );
}
