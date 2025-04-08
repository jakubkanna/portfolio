import "../../reset.css";
import "./App.css";
import { useEffect, useState } from "react";
import Sections from "../sections/Sections";
import Button from "../Button/Button";
import Menu from "../Menu/Menu";

function App() {
  useEffect(() => {
    const year = new Date().getFullYear();
    document.title = `JAKUB KANNA — Portfolio (fullstack) ${year}`;
  }, []);

  const [menuHidden, setMenuHidden] = useState(true);

  const toggleMenu = () => setMenuHidden((prev) => !prev);

  return (
    <main>
      <Sections />
      <Button
        id="Menu"
        style={{ position: "fixed", bottom: "0", right: "0", margin: "1rem" }}
        onClick={toggleMenu}
      >
        Menu
      </Button>
      <Menu hidden={menuHidden} toggle={toggleMenu} />
    </main>
  );
}

export default App;
