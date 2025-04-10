import "./Projects.css";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import RehypeVideo from "rehype-video";
import rehypeRaw from "rehype-raw";
import Section from "../../Section/Section";
import matter from "gray-matter";

const ProjectsSection = ({ containerYProgress, threshold }: ProjectsProps) => {
  const [files, setFiles] = useState<
    Record<string, { title: string; content: string }>
  >({});
  const divRef = useRef<HTMLDivElement>(null);
  const buffer = (threshold.to - threshold.from) * 0.2;
  const from = threshold.from + buffer;
  const to = threshold.to - buffer / 2;

  useEffect(() => {
    // Dynamically import all .md files in the docs folder
    const markdownFiles = import.meta.glob("/docs/*.md", { as: "raw" });

    const loadFiles = async () => {
      const loadedFiles: Record<string, { title: string; content: string }> =
        {};

      for (const path in markdownFiles) {
        const raw = await markdownFiles[path]();
        const { data, content } = matter(raw); //strip data from md
        const title = data.title || "Untitled";
        loadedFiles[path] = { title, content };
      }

      setFiles(loadedFiles);
    };

    loadFiles();
  }, []);

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;

    if (containerYProgress >= from && containerYProgress <= to) {
      const normalizedProgress = (containerYProgress - from) / (to - from);
      const maxScroll = el.scrollHeight - el.clientHeight;
      el.scrollTop = normalizedProgress * maxScroll;
    }
  }, [containerYProgress, from, to]);

  return (
    <Section id="Projects" title="Projects">
      <div className="projects-wrapper" ref={divRef}>
        {Object.entries(files).map(([filename, { title, content }], i) => (
          <div id={"P" + i} className="project" key={filename}>
            <h2>{title}</h2>
            <Markdown
              rehypePlugins={[[RehypeVideo, { details: false }], rehypeRaw]}
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
