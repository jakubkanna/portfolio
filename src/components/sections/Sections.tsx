import { useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import CVSection from "./CV.section";
import LogoSection from "./Logo.section";
import { useState } from "react";
import ProjectsSection from "./Projects/Projects.section";
import MoreSection from "./More.section";

export default function Sections() {
  const { scrollYProgress } = useScroll({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [yProgress, setYProgress] = useState(0);
  const projectsTreshold = { index: 2, from: 0.3, to: 0.8 }; // Projects gets 60%
  const cvThreshold = { index: 1, from: 0.1, to: 0.3 };
  // Add a spring animation to smooth out the scroll progress
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400,
  });

  // Section ranges based on scroll progress (0 to 1)
  // Example: 0.0–0.1 => Logo, 0.1–0.3 => CV, 0.3–0.8 => Projects, 0.8–1.0 => Contact
  const sectionThresholds = [
    { index: 0, from: 0.0, to: 0.1 },
    cvThreshold,
    projectsTreshold,
    { index: 3, from: projectsTreshold.to, to: 0.9 },
    { index: 4, from: 0.9, to: 1.0 },
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
    <CVSection
      key="cv"
      containerYProgress={yProgress}
      threshold={cvThreshold}
    />,
    <ProjectsSection
      key="projects"
      containerYProgress={yProgress}
      threshold={projectsTreshold}
    />,
    <MoreSection key="more" />,
  ];

  return sections[currentIndex];
}
