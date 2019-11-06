import { ThemeContext } from "./index";
import React from "react";

const useTheme = Component => props => (
	<ThemeContext.Consumer>
		{({ isDark, toggleTheme }) => <Component {...props} theme={({ isDark, toggleTheme })} />}
	</ThemeContext.Consumer>
);

export default useTheme;