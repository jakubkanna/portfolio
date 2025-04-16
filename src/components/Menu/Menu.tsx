// import { useEffect } from "react";
import "./Menu.css";
import MenuButtons from "./MenuButtons";

export default function Menu({ hidden = true, toggle }: MenuProps) {
  return (
    !hidden && (
      <div id="Menu" className="menu">
        <nav>
          <MenuButtons />
        </nav>
        <div className="btn-close" onClick={toggle}></div>
      </div>
    )
  );
}
