import { useRef } from "react";
import "./Section.css";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

export default function Section({ children, id, title }: SectionProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // set context {boolean, id}
  });

  return (
    <motion.section
      id={id + "Section"}
      className="section"
      ref={ref}
      style={{
        opacity: 1,
      }}
    >
      {title && <h1>{title}</h1>}
      <div className="section-content">{children}</div>
    </motion.section>
  );
}
