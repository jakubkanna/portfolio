import { useEffect } from "react";
import "../../reset.css";
import "./App.css";
import LogoSection from "../sections/Logo.section";

function App() {
  // init
  useEffect(() => {
    const year = new Date().getFullYear();
    document.title = `JAKUB KANNA — Portfolio (fullstack) ${year}`;
  }, []);

  const sections = [<LogoSection />];

  return (
    <div className="App">
      {sections.map((section, index) => (
        <div key={index}>{section}</div>
      ))}
    </div>
  );
}

export default App;
