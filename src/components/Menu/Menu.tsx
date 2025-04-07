// import { useEffect } from "react";
import "./Menu.css";

export default function Menu({ hidden = true, toggle }: MenuProps) {
  // useEffect(() => {
  //   // Disable scrolling on the body when menu is visible
  //   if (!hidden) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }

  //   // Cleanup when the component unmounts or menu state changes
  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [hidden]);

  return (
    !hidden && (
      <div id="Menu" className="menu">
        <nav>
          <ul>
            <li>
              <a href="#Logo">Scroll to top</a>
            </li>
            <li>
              <ul>
                <li>
                  <a href="#Project-1">Project 1</a>
                </li>
                <li>
                  <a href="#Project-2">Project 2</a>
                </li>
                <li>
                  <a href="#Project-3">Project 3</a>
                </li>
                <li>
                  <a href="#Project-4">Project 4</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#Contact">Contact</a>
            </li>
          </ul>
        </nav>
        <button onClick={toggle}>close</button>
      </div>
    )
  );
}
