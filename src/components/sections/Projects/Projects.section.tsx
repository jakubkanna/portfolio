import "./Projects.css";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import RehypeVideo from "rehype-video";
import rehypeRaw from "rehype-raw";
import Section from "../../Section/Section";
import matter from "gray-matter";
import MoveIn from "../../animated/MoveIn/MoveIn";
import AsciiLoader from "../../animated/Loader/Loader";

const Icons = ({ behance, github, url }: IconsProps) => {
  const size = 14;

  return (
    <div className="icons">
      {behance && (
        <a href={behance} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="currentColor"
            className="bi bi-behance"
            viewBox="0 0 16 16"
          >
            <path d="M4.654 3c.461 0 .887.035 1.278.14.39.07.711.216.996.391s.497.426.641.747c.14.32.216.711.216 1.137 0 .496-.106.922-.356 1.242-.215.32-.566.606-.997.817.606.176 1.067.496 1.348.922s.461.957.461 1.563c0 .496-.105.922-.285 1.278a2.3 2.3 0 0 1-.782.887c-.32.215-.711.39-1.137.496a5.3 5.3 0 0 1-1.278.176L0 12.803V3zm-.285 3.978c.39 0 .71-.105.957-.285.246-.18.355-.497.355-.887 0-.216-.035-.426-.105-.567a1 1 0 0 0-.32-.355 1.8 1.8 0 0 0-.461-.176c-.176-.035-.356-.035-.567-.035H2.17v2.31c0-.005 2.2-.005 2.2-.005zm.105 4.193c.215 0 .426-.035.606-.07.176-.035.356-.106.496-.216s.25-.215.356-.39c.07-.176.14-.391.14-.641 0-.496-.14-.852-.426-1.102-.285-.215-.676-.32-1.137-.32H2.17v2.734h2.305zm6.858-.035q.428.427 1.278.426c.39 0 .746-.106 1.032-.286q.426-.32.53-.64h1.74c-.286.851-.712 1.457-1.278 1.848-.566.355-1.243.566-2.06.566a4.1 4.1 0 0 1-1.527-.285 2.8 2.8 0 0 1-1.137-.782 2.85 2.85 0 0 1-.712-1.172c-.175-.461-.25-.957-.25-1.528 0-.531.07-1.032.25-1.493.18-.46.426-.852.747-1.207.32-.32.711-.606 1.137-.782a4 4 0 0 1 1.493-.285c.606 0 1.137.105 1.598.355.46.25.817.532 1.102.958.285.39.496.851.641 1.348.07.496.105.996.07 1.563h-5.15c0 .58.21 1.11.496 1.396m2.24-3.732c-.25-.25-.642-.391-1.103-.391-.32 0-.566.07-.781.176s-.356.25-.496.39a.96.96 0 0 0-.25.497c-.036.175-.07.32-.07.46h3.196c-.07-.526-.25-.882-.497-1.132zm-3.127-3.728h3.978v.957h-3.978z" />
          </svg>
        </a>
      )}{" "}
      {github && (
        <a href={github} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="currentColor"
            className="bi bi-github"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
          </svg>{" "}
        </a>
      )}{" "}
      {url && (
        <a href={url} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
            />
            <path
              fill-rule="evenodd"
              d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
            />
          </svg>
        </a>
      )}
    </div>
  );
};

const ProjectsSection = ({ containerYProgress, threshold }: SectionProps) => {
  const [files, setFiles] = useState<
    Record<
      string,
      {
        title: string;
        subtitle: string;
        date: Date;
        content: string;
        github?: string;
        behance?: string;
        url?: string;
      }
    >
  >({});

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const markdownFiles = import.meta.glob("/docs/projects/*.md", {
      as: "raw",
    });

    const loadFiles = async () => {
      const loadedFiles: Record<
        string,
        {
          title: string;
          subtitle: string;
          date: Date;
          content: string;
          github?: string;
          behance?: string;
          url?: string;
        }
      > = {};

      for (const path in markdownFiles) {
        const raw = await markdownFiles[path]();
        const { data, content } = matter(raw);
        const {
          title = "Untitled",
          subtitle = "",
          date = "",
          github,
          behance,
          url,
        } = data;
        loadedFiles[path] = {
          title,
          subtitle,
          date: new Date(date),
          content,
          github,
          behance,
          url,
        };
      }

      setFiles(loadedFiles);
      setReady(true); // Mark as ready once all files are loaded
    };

    loadFiles();
  }, []);

  return (
    <Section
      id="Projects"
      title="Projects"
      subtitle=""
      containerYProgress={containerYProgress}
      threshold={threshold}
      label={""}
    >
      <div className="projects-container">
        {Object.entries(files).map(
          (
            [
              filename,
              { title, subtitle, date, content, github, behance, url },
            ],
            i
          ) => (
            <div id={"P" + i} className="project" key={filename}>
              <MoveIn>
                <div className="project-info">
                  <span className="title">{title}</span>
                  <div className="flex-center">
                    <span className="subtitle">{subtitle}</span>
                    <span className="date">
                      {", "}
                      {date.getFullYear()}
                    </span>
                    <Icons github={github} behance={behance} url={url} />
                  </div>
                </div>
              </MoveIn>
              <MoveIn>
                <Markdown
                  rehypePlugins={[[RehypeVideo, { details: false }], rehypeRaw]}
                >
                  {content}
                </Markdown>
              </MoveIn>
            </div>
          )
        )}
        {!ready && <AsciiLoader />} {/* Only show loader while loading */}
      </div>
    </Section>
  );
};

export default ProjectsSection;
