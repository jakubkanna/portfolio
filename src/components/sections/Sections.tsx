import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import SingleSection from "./Single.section";
import { sequenceThreshold, typewriterThreshold } from "./thresholds";
import ScrollSequence from "../animated/ScrollSequence/ScrollSequence";
import AnimatedText from "../animated/Typewriter/AnimatedText";

export default function Sections() {
  const { scrollYProgress } = useScroll();
  const [currentIndex, setCurrentIndex] = useState(0);

  //
  const sections = [
    <SingleSection
      id="Sequence"
      key="Sequence"
      containerYProgress={scrollYProgress}
      threshold={sequenceThreshold}
      label="Sequence"
      content={
        <ScrollSequence
          containerYProgress={scrollYProgress}
          threshold={sequenceThreshold}
        />
      }
    />,
    <SingleSection
      id="Typewriter"
      key="Typewriter"
      containerYProgress={scrollYProgress}
      threshold={typewriterThreshold}
      label="Typewriter"
      content={
        <AnimatedText
          message={`View latest projects at <a href="https://instagram.com/studio.jkn" target="_blank"> @studio.jkn</a>🌍`}
        />
      }
      arrow={false}
    />,
  ];

  //set the scroll-container (body) height
  useEffect(() => {
    const value = sections.length * 400 + "vh";
    document.documentElement.style.setProperty("--body-height", value);
  }, [scrollYProgress, sections.length]);

  // Section ranges based on scroll progress (0 to 1)
  // Example: 0.0–0.1 => Logo, 0.1–0.3 => CV, 0.3–0.8 => Projects, 0.8–1.0 => Contact
  const sectionThresholds = useMemo(() => {
    return [typewriterThreshold, sequenceThreshold];
  }, []);

  // sections switching logic
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const active = sectionThresholds.find((section) => {
      return latest >= section.from && latest < section.to; //is within the range
    });

    if (active && active.index !== currentIndex) {
      setCurrentIndex(active.index);
    }
  });

  return sections[currentIndex];
}
