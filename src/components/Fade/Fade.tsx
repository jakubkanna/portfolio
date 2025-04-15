import "./Fade.css";

interface FadeProps {
  children: React.ReactNode;
}

export default function Fade({ children }: FadeProps) {
  return <div className="fade">{children}</div>;
}
