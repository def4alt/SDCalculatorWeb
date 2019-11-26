import React from "react";

import { ThemeContext } from "../Theme";
import { LocalizationContext, stringsType } from "../Localization";
import { AuthUserContext } from "../Session";

import * as ROUTES from "../../Constants/routes";

import { WiDaySunny, WiNightClear } from "react-icons/wi";

import "./index.scss";

import SignOutButton from "../SignOut";

const Navigation: React.SFC = () => (
	<div>
		<LocalizationContext.Consumer>
			{({ strings, setLocale }) => (
				<ThemeContext.Consumer>
					{({ isDark, toggleTheme }) => (
						<AuthUserContext.Consumer>
							{authUser =>
								authUser ? (
									<NavigationAuth
										theme={{ isDark, toggleTheme }}
										strings={strings as stringsType}
										setLocale={setLocale}
									/>
								) : (
									<NavigationNonAuth
										theme={{ isDark, toggleTheme }}
										strings={strings as stringsType}
										setLocale={setLocale}
									/>
								)
							}
						</AuthUserContext.Consumer>
					)}
				</ThemeContext.Consumer>
			)}
		</LocalizationContext.Consumer>
	</div>
);

interface NavigationProps {
	theme: {
		isDark: boolean;
		toggleTheme: () => void;
	};
	strings: stringsType;
	setLocale: (code: string) => void;
}

const NavigationAuth: React.SFC<NavigationProps> = props => (
	<div className="nav">
		<input type="checkbox" id="nav-check" />
		<div className="nav-brand">
			<a href={ROUTES.LANDING}>
				SDCalculatorWeb
			</a>
		</div>
		<div className="nav-links">
			<a href={ROUTES.HOME}>{props.strings.home}</a>
			<a href={ROUTES.ACCOUNT}>{props.strings.account}</a>
		</div>
		<div className="locale">
			<button onClick={() => props.setLocale("en")}>En</button>
			<button onClick={() => props.setLocale("ru")}>Ru</button>
			<button onClick={() => props.setLocale("uk")}>Uk</button>
		</div>
		<div className="theme">
			<button onClick={() => props.theme.toggleTheme()}>
				{!props.theme.isDark ? <WiNightClear /> : <WiDaySunny />}
			</button>
		</div>
		<div className="signOut">
			<SignOutButton />
		</div>
		<div className="nav-btn">
			<label htmlFor="nav-check">
				<span></span>
				<span></span>
				<span></span>
			</label>
		</div>
	</div>
);

const NavigationNonAuth: React.SFC<NavigationProps> = props => (
	
	<div className="nav">
		<input type="checkbox" id="nav-check" />
		<div className="nav-brand">
			<a href={ROUTES.LANDING}>
				SDCalculatorWeb
			</a>
		</div>
		<div className="nav-links">
			<a href={ROUTES.HOME}>{props.strings.home}</a>
			<a href={ROUTES.SIGN_IN}>{props.strings.signIn}</a>
		</div>
		<div className="locale">
			<button onClick={() => props.setLocale("en")}>En</button>
			<button onClick={() => props.setLocale("ru")}>Ru</button>
			<button onClick={() => props.setLocale("uk")}>Uk</button>
		</div>
		<div className="theme">
			<button onClick={() => props.theme.toggleTheme()}>
				{!props.theme.isDark ? <WiNightClear /> : <WiDaySunny />}
			</button>
		</div>
		<div className="nav-btn">
			<label htmlFor="nav-check">
				<span></span>
				<span></span>
				<span></span>
			</label>
		</div>
	</div>
);

export default Navigation;
