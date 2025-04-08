import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type ThemeType = "light" | "dark";
export interface ThemeContextType {
  theme:    ThemeType;
  setTheme: Dispatch<SetStateAction<ThemeType>>;
};

const ThemeContextContent: ThemeContextType = {
  theme:    "dark",
  setTheme: () => {},
};
export const ThemeContext    = createContext(ThemeContextContent);
export const useThemeContext = () => useContext(ThemeContext);