import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext/ThemeContext";
import { BiMoon, BiSun } from "react-icons/bi";

const ThemeSwitcher = () => {
  const context = useContext(ThemeContext);
	const Icon = context.theme === "light" ? BiMoon : BiSun;
  return (
    <>
      <button
        onClick={() => {
          context.setTheme(context.theme === "light" ? "dark" : "light");
        }}
      >
				<div className="flex items-center">
					<Icon />
				</div>
			</button>
    </>
  );
};

export default ThemeSwitcher;