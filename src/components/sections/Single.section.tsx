import Section from "../Section/Section";

export default function SingleSection({
  containerYProgress,
  threshold,
  content,
  id,
  label,
  arrow,
}: SectionProps) {
  return (
    <Section
      id={id}
      label={label}
      title=""
      containerYProgress={containerYProgress}
      threshold={threshold}
      arrow={arrow}
    >
      <div className="container">
        <div className="content">{content}</div>
      </div>
    </Section>
  );
}
