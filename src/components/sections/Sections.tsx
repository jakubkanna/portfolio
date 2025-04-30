import { useMotionValueEvent, useScroll } from "motion/react";
import { useMemo, useState } from "react";
import ProjectsSection from "./Projects/Projects.section";
import SingleSection from "./Single/Single.section";
import HelloSection from "./Hello.section";
import {
  introThreshold,
  cvThreshold,
  projectsTreshold,
  moreTreshold,
} from "./thresholds";
import CVSection from "./CV.section";

export default function Sections() {
  const { scrollYProgress } = useScroll({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Section ranges based on scroll progress (0 to 1)
  // Example: 0.0–0.1 => Logo, 0.1–0.3 => CV, 0.3–0.8 => Projects, 0.8–1.0 => Contact
  const sectionThresholds = useMemo(() => {
    return [introThreshold, cvThreshold, projectsTreshold, moreTreshold];
  }, []);

  // sections switching logic
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const active = sectionThresholds.find((section) => {
      return latest >= section.from && latest < section.to;
    });

    if (active && active.index !== currentIndex) {
      setCurrentIndex(active.index);
    }
  });

  const sections = [
    <HelloSection
      key="Hello"
      containerYProgress={scrollYProgress}
      threshold={sectionThresholds[0]}
      label="Hello"
    />,
    <CVSection
      key="cv"
      containerYProgress={scrollYProgress}
      threshold={sectionThresholds[1]}
      label="CV"
    />,
    <ProjectsSection
      key="projects"
      containerYProgress={scrollYProgress}
      threshold={sectionThresholds[2]}
      label="projects"
    />,
    <SingleSection
      key="more"
      containerYProgress={scrollYProgress}
      threshold={sectionThresholds[3]}
      label="more"
      title="And more..."
    />,
  ];

  return sections[currentIndex];
}
