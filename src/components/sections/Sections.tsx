import { useMotionValueEvent, useScroll } from "framer-motion";
import CVSection from "./CV.section";
import LogoSection from "./Logo.section";
import { useMemo, useState } from "react";
import ProjectsSection from "./Projects/Projects.section";
import MoreSection from "./More.section";

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

  // useEffect(() => {
  //   // Lock scrolling for 1 second
  //   const originalOverflow = document.body.style.overflow;
  //   document.body.style.overflow = "hidden";

  //   const timeout = setTimeout(() => {
  //     document.body.style.overflow = originalOverflow;
  //     console.log("Scroll unlocked");
  //   }, 1000);

  //   return () => clearTimeout(timeout); // Clean up
  // }, [currentIndex]);

  const sections = [
    <LogoSection key="logo" containerYProgress={scrollYProgress} />,
    <CVSection
      key="cv"
      containerYProgress={scrollYProgress}
      threshold={sectionThresholds[1]}
    />,
    <ProjectsSection
      key="projects"
      containerYProgress={scrollYProgress}
      threshold={sectionThresholds[2]}
    />,
    <MoreSection
      key="more"
      containerYProgress={scrollYProgress}
      threshold={sectionThresholds[3]}
    />,
  ];

  return sections[currentIndex];
}
