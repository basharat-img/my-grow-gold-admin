import React from "react";
import { FiMenu, FiMoon, FiSearch, FiSun } from "react-icons/fi";
import { Button } from "../ui/button";
import { useTheme } from "../../context/ThemeContext";
import { darkTheme, lightTheme } from "../../config/theme";

const Header = ({ onToggleSidebar }) => {
  const { theme, setTheme } = useTheme();

  const isDark = theme.appearance === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? lightTheme : darkTheme);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] p-2 text-slate-500 transition-colors hover:text-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <div className="hidden items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 text-sm text-slate-500 md:flex">
          <FiSearch className="mr-2 h-4 w-4" />
          <span>Search insights...</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          className="rounded-full border border-[var(--color-border)] p-2 text-slate-500 hover:text-slate-800"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
        </Button>
        <div className="flex items-center space-x-2 rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-600">Live</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
