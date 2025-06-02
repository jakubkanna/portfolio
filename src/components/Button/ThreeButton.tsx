import { useEffect, useState } from "react";
import "./Button.css";

export default function ThreeButton({ toggle = () => {} }) {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="three-button-container"
      onClick={toggle}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <div className="tooltip">
          click to open menu
          <div className="tooltip-arrow" />
        </div>
      )}

      <div
        dangerouslySetInnerHTML={{
          __html: `
            <model-viewer
              id="menuButton"
              src="./jk-logo.glb"
              tone-mapping="neutral"
              shadow-intensity="0"
              auto-rotate
              interaction-prompt="none"
              camera-orbit="90deg"
              style="height:90px; width:120px; padding-right:20px;"
            ></model-viewer>
          `,
        }}
      />
    </div>
  );
}
