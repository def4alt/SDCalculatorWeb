import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import SignOutButton from "../SignOut";

import { ThemeContext } from "../Theme";

import * as ROUTES from "../../constants/routes";

import { AuthUserContext } from "../Session";
import Button from "react-bootstrap/Button";
import { LocalizationContext } from "../Localization";

const Navigation = () => (
	<LocalizationContext.Consumer>
		{({ strings, setLocale }) => (
			<ThemeContext.Consumer>
				{({ theme, toggleTheme }) => (
					<div>
						<AuthUserContext.Consumer>
							{authUser =>
								authUser ? (
									<NavigationAuth
										theme={{ theme, toggleTheme }}
										strings={strings}
										setLocale={setLocale}
									/>
								) : (
									<NavigationNonAuth
										theme={{ theme, toggleTheme }}
										strings={strings}
										setLocale={setLocale}
									/>
								)
							}
						</AuthUserContext.Consumer>
					</div>
				)}
			</ThemeContext.Consumer>
		)}
	</LocalizationContext.Consumer>
);

const NavigationAuth = props => (
	<Navbar
		className="nav"
		bg={props.theme.theme.name}
		expand="lg"
		variant={props.theme.theme.navBarVariant}
	>
		<Navbar.Brand href={ROUTES.LANDING}>SDCalculatorWeb</Navbar.Brand>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse id="basic-navbar-nav">
			<Nav className="mr-auto">
				<Nav.Link href={ROUTES.HOME}>{props.strings.home}</Nav.Link>
				<Nav.Link href={ROUTES.ACCOUNT}>
					{props.strings.account}
				</Nav.Link>
			</Nav>
			<Nav className="mr-10">
				<Nav.Link
					variant={props.theme.theme.variant}
					onClick={() => props.setLocale("en")}
				>
					En
				</Nav.Link>
				<Nav.Link
					variant={props.theme.theme.variant}
					onClick={() => props.setLocale("ru")}
				>
					Ru
				</Nav.Link>
				<Nav.Link
					variant={props.theme.theme.variant}
					onClick={() => props.setLocale("uk")}
				>
					Uk
				</Nav.Link>
			</Nav>
			<Nav className="mr-0">
				<Button
					variant={props.theme.theme.variant}
					onClick={() => props.theme.toggleTheme()}
				>
					{props.theme.theme.navBarIcon}
				</Button>
			</Nav>
			<Nav>
				<SignOutButton />
			</Nav>
		</Navbar.Collapse>
	</Navbar>
);

const NavigationNonAuth = props => (
	<Navbar
		className="nav"
		bg={props.theme.theme.name}
		expand="lg"
		variant={props.theme.theme.navBarVariant}
	>
		<Navbar.Brand href={ROUTES.LANDING}>SDCalculatorWeb</Navbar.Brand>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse id="basic-navbar-nav">
			<Nav className="mr-auto">
				<Nav.Link href={ROUTES.HOME}>{props.strings.home}</Nav.Link>
				<Nav.Link href={ROUTES.SIGN_IN}>
					{props.strings.signIn}
				</Nav.Link>
			</Nav>
			<Nav className="mr-0">
				<Button
					variant={props.theme.theme.variant}
					onClick={() => props.theme.toggleTheme()}
				>
					{props.theme.theme.navBarIcon}
				</Button>
			</Nav>

			<Nav className="mr-1"></Nav>
		</Navbar.Collapse>
	</Navbar>
);

export default Navigation;
