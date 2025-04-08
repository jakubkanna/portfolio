import ContactSection from "./Contact.section";
import CVSection from "./CV.section";
import LogoSection from "./Logo.section";
import ProjectsSection from "./Projects.section";

export default function Sections() {
  const sections = [
    <LogoSection key="logo" />,
    <CVSection key="cv" />,
    <ProjectsSection key="projects" />,
    <ContactSection key="contact" />,
  ];

  return sections;
}
