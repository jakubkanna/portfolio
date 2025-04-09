import { motion } from "framer-motion";
import "./Section.css";

export default function Section({ children, id, title }: SectionProps) {
  return (
    <motion.section id={id + "Section"} className="section">
      {title && <h1>{title}</h1>}
      <div className="section-content container">{children}</div>
    </motion.section>
  );
}
