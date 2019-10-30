import { ThemeContext } from "./index";
import React from "react";

const useTheme = Component => props => (
	<ThemeContext.Consumer>
		{({ theme, toggleTheme }) => <Component {...props} theme={({ theme, toggleTheme })} />}
	</ThemeContext.Consumer>
);

export default useTheme;