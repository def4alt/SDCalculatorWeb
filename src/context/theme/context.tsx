import React from "react";

type ThemeContext = {
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = React.createContext<ThemeContext>({
  toggleTheme: () => null,
  isDark: false
});

export default ThemeContext;
