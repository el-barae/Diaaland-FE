

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/solid"; // Import from the same library

const NavbarTools = () => {
  const { systemTheme, theme, setTheme } = useTheme();

  const renderThemeChanger = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <SunIcon
          className="w-7 h-7"
          role="button"
          onClick={() => setTheme("light")}
        />
      );
    } else {
      return (
        <MoonIcon
          className="w-7 h-7"
          role="button"
          onClick={() => setTheme("dark")}
        />
      );
    }
  };

  return (
    <>
      <div className="tools dark:border-gray-700">
        {/* <div className="languages">english</div> */}
        <div className="dark-mode">
          {renderThemeChanger()}
        </div>
      </div>
    </>
  );
};

export default NavbarTools;
