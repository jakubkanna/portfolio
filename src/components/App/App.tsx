import "../../reset.css";
import "./App.css";
import { useEffect, useState } from "react";
import Sections from "../sections/Sections";
import Menu from "../Menu/Menu";
import { applyDarkMode } from "../../utils/applyDarkMode";

function App() {
  useEffect(() => {
    document.title = `JAKUB KANNA — artist, full-stack developer, graphic designer`;
  }, []);

  const [menuHidden, setMenuHidden] = useState(true);

  const toggleMenu = () => setMenuHidden((prev) => !prev);

  useEffect(() => {
    const darkModeSetting = localStorage.getItem("dark_mode");
    applyDarkMode(darkModeSetting === "true");

    // Optional: Listen to changes in localStorage (if multiple tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "dark_mode") {
        applyDarkMode(e.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <main>
      <Sections />
      <div
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          cursor: "pointer",
        }}
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
        onClick={toggleMenu}
      ></div>

      <Menu hidden={menuHidden} toggle={toggleMenu} />
    </main>
  );
}

export default App;
