export const lightTheme = {
  appearance: "light",
  colors: {
    primary: "#1c64f2",
    primaryForeground: "#f8fafc",
    surface: "#ffffff",
    muted: "#f1f5f9",
    mutedForeground: "#475569",
    border: "#d0d8e5",
    background: "#f8fafc",
  },
};

export const darkTheme = {
  appearance: "dark",
  colors: {
    primary: "#4f46e5",
    primaryForeground: "#f8fafc",
    surface: "#111827",
    muted: "#1f2937",
    mutedForeground: "#e5e7eb",
    border: "#1f2937",
    background: "#030712",
  },
};

export const themeConfig = lightTheme;

export const applyTheme = (theme) => {
  const root = document.documentElement;
  const { colors, appearance } = theme;
  root.setAttribute("data-theme", appearance);
  Object.entries(colors).forEach(([token, value]) => {
    const cssToken = token.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    root.style.setProperty(`--color-${cssToken}`, value);
  });
};
