import React from "react";

const ThemeContext = React.createContext({isDark: false, toggleTheme() {}});

export { ThemeContext };