interface SectionProps {
  children?: ReactNode;
  id?: string;
  title?: string;
  subtitle?: string;
  containerYProgress: MotionValue<number>;
  threshold?: { index: number; from: number; to: number };
  style?: React.CSSProperties;
  className?: string;
  label: string;
}
