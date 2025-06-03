import "./progress.css";

interface ProgressProps {
  progress: number; // should be between 0 and 1
}

export default function Progress({ progress }: ProgressProps) {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
  );
}
