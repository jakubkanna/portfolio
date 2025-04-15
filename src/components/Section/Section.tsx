import "./Section.css";
import { motion, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Fade from "../Fade/Fade";

export default function Section({
  children,
  id,
  title,
  subtitle,
  threshold,
  containerYProgress,
  style,
}: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const buffer = 0.05;
  const from = (threshold && threshold.from + buffer) || 0;
  const to = (threshold && threshold.to - buffer) || 0;
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(containerYProgress, "change", (latest: number) => {
    setProgress(latest);
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || progress == null) return;
    const normalizedProgress = (progress - from) / (to - from);
    const maxScroll = el.scrollHeight - el.clientHeight;
    el.scrollTop = normalizedProgress * maxScroll;
  }, [progress, from, to]);

  return (
    <motion.section
      ref={sectionRef}
      id={id + "Section"}
      className="section"
      style={style}
    >
      {title && <span className="title">{title}</span>}
      {subtitle && <span className="subtitle">{subtitle}</span>}
      <Fade>
        <div className="section-content">{children}</div>
      </Fade>
    </motion.section>
  );
}
