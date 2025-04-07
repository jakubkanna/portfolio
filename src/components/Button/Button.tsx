export default function Button({
  onClick,
  children,
  id,
  className,
  style,
}: ButtonProps) {
  return (
    <button
      id={id + "Btn"}
      className={className}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
