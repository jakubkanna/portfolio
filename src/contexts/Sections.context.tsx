import { createContext, Dispatch, SetStateAction } from "react";

type SectionsContextType = {
  index: number;
  position: number;
  setIndex: Dispatch<SetStateAction<number>>;
  setPosition: Dispatch<SetStateAction<number>>;
};

export const SectionsContext = createContext<SectionsContextType>({
  index: 0,
  position: 0,
  setIndex: () => {}, // You could throw here to catch uninitialized usage
  setPosition: () => {},
});
