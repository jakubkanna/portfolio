import "./Section.css";

export default function Section({
  children = <></>,
  id = "section",
  title,
}: SectionProps) {
  return (
    <section id={id} className="section">
      {title && <h1>{title}</h1>}
      {children}
    </section>
  );
}
