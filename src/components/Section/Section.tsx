import "./Section.css";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Section({
  children = <></>,
  id = "section",
  title,
}: SectionProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(scrollYProgress, (value) =>
    value === 1 ? 1 : 0
  );

  return (
    <motion.section
      id={id}
      className="section"
      ref={ref}
      style={{
        opacity: opacity,
      }}
    >
      {title && <h1>{title}</h1>}
      {children}
    </motion.section>
  );
}
