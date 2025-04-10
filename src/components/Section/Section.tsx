import { motion } from "framer-motion";
import "./Section.css";

export default function Section({
  children,
  id,
  title,
  subtitle,
}: SectionProps) {
  return (
    <motion.section id={id + "Section"} className="section">
      {title && <span className="title">{title}</span>}
      {subtitle && <span className="subtitle">{subtitle}</span>}
      <div className="section-content container">{children}</div>
    </motion.section>
  );
}
