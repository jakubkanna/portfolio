import Project from "../Project/Project";
import Section from "../Section/Section";

export default function ProjectsSection({
  projects,
}: {
  projects: ProjectData[];
}) {
  return (
    <Section id="Projects" title="Projects">
      {projects.map((project, i) => (
        <Project key={i} data={project} />
      ))}
    </Section>
  );
}
