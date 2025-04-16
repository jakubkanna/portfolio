import { useMotionValueEvent, useScroll } from "framer-motion";
import { useMemo, useState } from "react";
import ProjectsSection from "./Projects/Projects.section";
import SingleSection from "./Single/Single.section";
import HelloSection from "./Hello.section";

export default function Sections() {
  const { scrollYProgress } = useScroll({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Section ranges based on scroll progress (0 to 1)
  // Example: 0.0–0.1 => Logo, 0.1–0.3 => CV, 0.3–0.8 => Projects, 0.8–1.0 => Contact
  const sectionThresholds = useMemo(() => {
    const cvThreshold = { index: 1, from: 0.1, to: 0.3 };
    const projectsTreshold = { index: 2, from: 0.3, to: 0.8 }; // Projects gets 60%
    const moreTreshold = { index: 3, from: projectsTreshold.to, to: 1.0 };
    return [
      { index: 0, from: 0.0, to: 0.1 },
      cvThreshold,
      projectsTreshold,
      moreTreshold,
    ];
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const active = sectionThresholds.find((section) => {
      return latest >= section.from && latest < section.to;
    });

    if (active && active.index !== currentIndex) {
      setCurrentIndex(active.index);
      scrollYProgress.set(active.from);
    }
  });

  const sections = [
    <HelloSection
      key="Hello"
      containerYProgress={scrollYProgress}
      threshold={sectionThresholds[0]}
      label="Hello"
    />,
    <SingleSection
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
