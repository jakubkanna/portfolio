import { AnimatePresence, motion } from "motion/react";
import "./Menu.css";
import MenuButtons from "./MenuButtons";

export default function Menu({ hidden, toggle }: MenuProps) {
  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ x: "120%" }}
          animate={{ x: "0" }}
          exit={{ x: "120%" }}
          id="Menu"
          className="menu"
        >
          <nav>
            <MenuButtons />
          </nav>
          <div className="btn-close" onClick={toggle}></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
