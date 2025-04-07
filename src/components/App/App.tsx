import { useEffect } from "react";
import "../../reset.css";
import "./App.css";
import LogoSection from "../sections/Logo.section";
import CVSection from "../sections/CV.section";
import ContactSection from "../sections/Contact.section";

function App() {
  // init
  useEffect(() => {
    const year = new Date().getFullYear();
    document.title = `JAKUB KANNA — Portfolio (fullstack) ${year}`;
  }, []);

  const sections = [<LogoSection />, <CVSection />, <ContactSection />];

  return (
    <div className="App">
      {sections.map((section, index) => (
        <div key={index}>{section}</div>
      ))}
    </div>
  );
}

export default App;
