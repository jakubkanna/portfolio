import "./Fade.css";
import { useRef } from "react";

interface FadeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Fade({ children, className }: FadeProps) {
  const ref = useRef(null);

  return (
    <div className={`${className}`}>
      {/* The animated mask */}
      <div className="fade" ref={ref}>
        {children}
      </div>
    </div>
  );
}
