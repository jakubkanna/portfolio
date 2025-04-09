import "./Projects.css";
import { useEffect, useRef, useState } from "react";
import Section from "../Section/Section";
import Markdown from "react-markdown";
import RehypeVideo from "rehype-video";

const ProjectsSection = ({ containerYProgress, threshold }: ProjectsProps) => {
  const [files, setFiles] = useState<Record<string, string>>({});
  const divRef = useRef<HTMLDivElement>(null);
  const buffer = (threshold.to - threshold.from) * 0.2;
  // (threshold.to - threshold.from) * 0.2;
  const from = threshold.from + buffer;
  const to = threshold.to - buffer / 2;

  useEffect(() => {
    // Dynamically import all .md files in the docs folder
    const markdownFiles = import.meta.glob("/docs/*.md", { as: "raw" });

    const loadFiles = async () => {
      const loadedFiles: Record<string, string> = {};
      for (const path in markdownFiles) {
        const content = await markdownFiles[path]();
        loadedFiles[path] = content;
      }
      setFiles(loadedFiles);
    };

    loadFiles();
  }, []);

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;
    // Check if the progress is within the threshold range
    if (containerYProgress >= from && containerYProgress <= to) {
      // Normalize progress within the threshold range
      const normalizedProgress = (containerYProgress - from) / (to - from);

      // Calculate the scroll position based on normalized progress
      const maxScroll = el.scrollHeight - el.clientHeight;
      el.scrollTop = normalizedProgress * maxScroll;
    }
  }, [containerYProgress, from, to]);

  return (
    <Section id="Projects" title="Projects">
      <div className="projects-wrapper" ref={divRef}>
        {Object.entries(files).map(([filename, content], i) => (
          <div id={"P" + i} className="project" key={filename}>
            <Markdown
              rehypePlugins={[
                [
                  RehypeVideo,
                  {
                    details: false,
                  },
                ],
              ]}
            >
              {content}
            </Markdown>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default ProjectsSection;
