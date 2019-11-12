import { ThemeContext } from "./index";
import React from "react";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type useThemeProps = {
	isDark: boolean;
	toggleTheme: () => void;
};

const useTheme = <P extends object>(
	Component: React.ComponentType<P>
): React.FC<Omit<P, keyof useThemeProps>> => props => (
	<ThemeContext.Consumer>
		{({ isDark, toggleTheme }) => (
			<Component {...(props as P)} theme={{ isDark, toggleTheme }} />
		)}
	</ThemeContext.Consumer>
);


export default useTheme;