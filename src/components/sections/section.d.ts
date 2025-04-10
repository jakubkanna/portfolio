interface SectionProps {
  children?: ReactNode;
  id?: string;
  title?: string;
  subtitle?: string;
  containerYProgress?: number;
  threshold?: { index: number; from: number; to: number };
  style?: React.CSSProperties;
}
