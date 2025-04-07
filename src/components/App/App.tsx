import { useEffect, useState } from "react";
import "../../reset.css";
import "./App.css";
import LogoSection from "../sections/Logo.section";
import CVSection from "../sections/CV.section";
import ContactSection from "../sections/Contact.section";
import Menu from "../Menu/Menu";
import Button from "../Button/Button";

function App() {
  // init
  useEffect(() => {
    const year = new Date().getFullYear();
    document.title = `JAKUB KANNA — Portfolio (fullstack) ${year}`;
  }, []);

  const sections = [<LogoSection />, <CVSection />, <ContactSection />];
  const [menuHidden, setMenuHidden] = useState(true);
  const toggleMenu = () => {
    setMenuHidden((prev) => !prev);
    console.log("is menu hidden?", menuHidden);
  };

  return (
    <div className="App">
      {sections.map((section, index) => (
        <div key={index}>{section}</div>
      ))}
      <Button
        id="Menu"
        style={{ position: "fixed", bottom: "0", right: "0", margin: "1rem" }}
        onClick={toggleMenu}
      >
        Menu
      </Button>
      <Menu hidden={menuHidden} toggle={toggleMenu} />
    </div>
  );
}

export default App;
