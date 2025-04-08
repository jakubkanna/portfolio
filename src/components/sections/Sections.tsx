import { projects } from "../../data/data";
import ProjectsSection from "../Projects/Projects.section";
import Section from "../Section/Section";
import ContactSection from "./Contact.section";
import CVSection from "./CV.section";
import LogoSection from "./Logo.section";

export default function Sections() {
  const sections = [
    <LogoSection />,
    <CVSection />,
    <ProjectsSection projects={projects} />,
    <ContactSection />,
    <Section id="footer" />,
  ];

  return sections;
}
