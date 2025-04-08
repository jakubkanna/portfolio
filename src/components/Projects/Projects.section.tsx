import { useEffect, useState } from "react";
import Section from "../Section/Section";
import "./Projects.css";
import Markdown from "react-markdown";
import RehypeVideo from "rehype-video";

const ProjectsSection = () => {
  const [files, setFiles] = useState<Record<string, string>>({});

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

  return (
    <Section id="Projects" title="Projects">
      {Object.entries(files).map(([filename, content]) => (
        <Markdown rehypePlugins={[RehypeVideo]} key={filename}>
          {content}
        </Markdown>
      ))}
    </Section>
  );
};

export default ProjectsSection;
