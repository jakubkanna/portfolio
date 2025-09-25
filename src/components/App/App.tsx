import "../../reset.css";
import "./App.css";
import { useEffect, useState } from "react";
import Sections from "../sections/Sections";
import Menu from "../Menu/Menu";
import { setDarkMode } from "../../utils/toggleDarkMode";
import ThreeButton from "../Buttons/ThreeButton";
import isMobile from "is-mobile";

function App() {
  useEffect(() => {
    document.title = `JAKUB KANNA — Graphic Designer, Full-stack Developer, Artist`;
    setDarkMode();
  }, []);

  const [menuHidden, setMenuHidden] = useState(isMobile());

  const toggleMenu = () => setMenuHidden((prev) => !prev);

  // useEffect(() => {
  //   // Apply dark mode based on localStorage setting
  //   const darkModeSetting = localStorage.getItem("dark_mode");

  //   // default to dark mode
  //   if (!darkModeSetting) setDarkMode();

  //   //
  //   applyDarkMode(darkModeSetting === "true");

  //   // Optional: Listen to changes in localStorage (if multiple tabs)
  //   const handleStorageChange = (e: StorageEvent) => {
  //     if (e.key === "dark_mode") {
  //       applyDarkMode(e.newValue === "true");
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  // }, []);

  return (
    <main>
      <Sections />
      <ThreeButton toggle={toggleMenu} />
      <Menu hidden={menuHidden} toggle={toggleMenu} />
    </main>
  );
}

export default App;
