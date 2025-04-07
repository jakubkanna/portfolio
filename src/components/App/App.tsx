import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const year = new Date().getFullYear();
    document.title = `JAKUB KANNA — Portfolio (fullstack) ${year}`;
  }, []);

  return <>Hello World</>;
}

export default App;
