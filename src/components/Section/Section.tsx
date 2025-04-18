import "./Section.css";
import { motion, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import MoveIn from "../animated/MoveIn/MoveIn";

export default function Section({
  children,
  id,
  title,
  subtitle,
  threshold,
  containerYProgress,
  style,
  className,
}: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

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
      id={id + "Section"}
      className={"section " + className}
      style={style}
    >
      <MoveIn>
        {title && <span className="title">{title}</span>}
        {subtitle && <span className="subtitle">{subtitle}</span>}
      </MoveIn>
      <div className="section-content" ref={sectionRef}>
        {children}
      </div>
    </motion.section>
  );
}
