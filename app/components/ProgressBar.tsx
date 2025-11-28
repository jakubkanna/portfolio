interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="fixed left-4 right-4 top-4 h-[2px] overflow-hidden z-10">
      <div
        className="h-full bg-accent transition-[width] duration-100"
        style={{ width: `${Math.min(Math.max(progress * 100, 0), 100)}%` }}
      />
    </div>
  );
}
