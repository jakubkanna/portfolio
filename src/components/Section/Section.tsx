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
  arrow = true,
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
      {arrow && (
        <div id="arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"
            />
          </svg>
        </div>
      )}
    </motion.section>
  );
}
