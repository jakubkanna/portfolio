import { motion } from "framer-motion";
import "./Section.css";
import { useEffect, useRef } from "react";
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
  const divRef = useRef<HTMLDivElement>(null);
  const buffer = 0.05; //(threshold && (threshold.to - threshold.from) * 0.1) || 0;
  const from = (threshold && threshold.from + buffer) || 0;
  const to = (threshold && threshold.to - buffer / 2) || 0;

  useEffect(() => {
    const el = divRef.current;
    if (!el || !containerYProgress) return;

    if (containerYProgress >= from && containerYProgress <= to) {
      const normalizedProgress = (containerYProgress - from) / (to - from);
      const maxScroll = el.scrollHeight - el.clientHeight;
      el.scrollTop = normalizedProgress * maxScroll;
    }
  }, [containerYProgress, from, to]);

  return (
    <motion.section id={id + "Section"} className="section" style={style}>
      {title && <span className="title">{title}</span>}
      {subtitle && <span className="subtitle">{subtitle}</span>}
      <div className="section-content container">
        <Fade>
          <div className="section-wrapper" ref={divRef}>
            {children}
          </div>
        </Fade>
      </div>
    </motion.section>
  );
}
