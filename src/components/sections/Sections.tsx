import { useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import ProjectsSection from "../Projects/Projects.section";
import ContactSection from "./Contact.section";
import CVSection from "./CV.section";
import LogoSection from "./Logo.section";
import { useState } from "react";

export default function Sections() {
  const { scrollYProgress } = useScroll({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [yProgress, setYProgress] = useState(0);
  const projectsTreshold = { index: 2, from: 0.3, to: 0.9 }; // Projects gets 60%
  // Add a spring animation to smooth out the scroll progress
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400,
  });

  // Section ranges based on scroll progress (0 to 1)
  // Example: 0.0–0.1 => Logo, 0.1–0.3 => CV, 0.3–0.8 => Projects, 0.8–1.0 => Contact
  const sectionThresholds = [
    { index: 0, from: 0.0, to: 0.1 },
    { index: 1, from: 0.1, to: 0.3 },
    projectsTreshold,
    { index: 3, from: projectsTreshold.to, to: 1.0 },
  ];

  useMotionValueEvent(smoothScrollYProgress, "change", (latest) => {
    setYProgress(latest);

    const active = sectionThresholds.find((section) => {
      return latest >= section.from && latest < section.to;
    });

    if (active && active.index !== currentIndex) {
      setCurrentIndex(active.index);
    }
  });

  const sections = [
    <LogoSection key="logo" />,
    <CVSection key="cv" />,
    <ProjectsSection
      key="projects"
      containerYProgress={yProgress}
      threshold={projectsTreshold}
    />,
    <ContactSection key="contact" />,
  ];

  return sections[currentIndex];
}
