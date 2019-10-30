import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import SignOutButton from "../SignOut";

import { ThemeContext, themes } from "../Theme";

import * as ROUTES from "../../constants/routes";

import { AuthUserContext } from "../Session";
import Button from "react-bootstrap/Button";

const Navigation = () => (
	<ThemeContext.Consumer>
		{({ theme, toggleTheme }) => (
			<div>
				<AuthUserContext.Consumer>
					{authUser =>
						authUser ? (
							<NavigationAuth theme={{ theme, toggleTheme }} />
						) : (
							<NavigationNonAuth theme={{ theme, toggleTheme }} />
						)
					}
				</AuthUserContext.Consumer>
			</div>
		)}
	</ThemeContext.Consumer>
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
				<Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
				<Nav.Link href={ROUTES.ACCOUNT}>Account</Nav.Link>
			</Nav>

			<Nav.Item>
				<Button
					variant={props.theme.theme.variant}
					onClick={() => props.theme.toggleTheme()}
				>
					{props.theme.theme.navBarIcon}
				</Button>
			</Nav.Item>
			<Nav.Item>
				<SignOutButton />
			</Nav.Item>
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
				<Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
				<Nav.Link href={ROUTES.SIGN_IN}>Sign In</Nav.Link>
			</Nav>
			<Nav.Item>
				<Button
					variant={props.theme.theme.variant}
					onClick={() => props.theme.toggleTheme()}
				>
					{props.theme.theme.navBarIcon}
				</Button>
			</Nav.Item>

			<Nav className="mr-0"></Nav>
		</Navbar.Collapse>
	</Navbar>
);

export default Navigation;
