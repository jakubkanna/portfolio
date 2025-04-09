import { motion } from "framer-motion";
import "./Section.css";

export default function Section({ children, id, title }: SectionProps) {
  return (
    <motion.section id={id + "Section"} className="section">
      {title && <p className="title">{title}</p>}
      <div className="section-content container">{children}</div>
    </motion.section>
  );
}
