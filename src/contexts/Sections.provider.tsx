import { useState } from "react";
import { SectionsContext } from "./Sections.context";

export default function SectionsProvider() {
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);
  return (
    <SectionsContext.Provider
      value={{ index, position, setIndex, setPosition }}
    ></SectionsContext.Provider>
  );
}
