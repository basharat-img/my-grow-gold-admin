import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { applyTheme, themeConfig as defaultTheme } from "../config/theme";

const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
