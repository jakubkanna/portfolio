import "./Button.css";

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
      className={"btn " + className}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
