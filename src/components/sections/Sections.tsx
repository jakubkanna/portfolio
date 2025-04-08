import ProjectsSection from "../Projects/Projects.section";
import Section from "../Section/Section";
import ContactSection from "./Contact.section";
import CVSection from "./CV.section";
import LogoSection from "./Logo.section";

export default function Sections() {
  const sections = [
    <LogoSection key="logo" />,
    <CVSection key="cv" />,
    <ProjectsSection key="projects" />,
    <ContactSection key="contact" />,
    <Section id="footer" key="footer" />,
  ];

  return sections;
}
