import React from "react";

import SignOutButton from "../SignOut";

import { ThemeContext } from "../Theme";

import * as ROUTES from "../../constants/routes";
import { WiDaySunny, WiNightClear } from "react-icons/wi";

import "./index.scss";

import { AuthUserContext } from "../Session";
import { LocalizationContext } from "../Localization";

const Navigation = () => (
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
										strings={strings}
										setLocale={setLocale}
									/>
								) : (
									<NavigationNonAuth
										theme={{ isDark, toggleTheme }}
										strings={strings}
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

const NavigationAuth = props => (
	<div className="nav">
		<a className="nav-brand" href={ROUTES.LANDING}>
			SDCalculatorWeb
		</a>
		<div className="mr-auto">
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
	</div>
);

const NavigationNonAuth = props => (
	<div className="nav">
		<a className="nav-brand" href={ROUTES.LANDING}>
			SDCalculatorWeb
		</a>
		<div className="mr-auto">
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
	</div>
);

export default Navigation;
