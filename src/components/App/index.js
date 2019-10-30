import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";

import * as ROUTES from "../../constants/routes";

import "./index.css";

import { withAuthentication } from "../Session";
import { withTheme, useTheme } from "../Theme";
import { compose } from "recompose";

const App = props => (
	<CookiesProvider>
		<Router>
			<div
				className="root"
				style={{ backgroundColor: props.theme.theme.backgroundColor }}
			>
				<Navigation />

				<Route exact path={ROUTES.LANDING} component={SignInPage} />
				<Route path={ROUTES.SIGN_UP} component={SignUpPage} />
				<Route path={ROUTES.SIGN_IN} component={SignInPage} />
				<Route
					path={ROUTES.PASSWORD_FORGET}
					component={PasswordForgetPage}
				/>
				<Route path={ROUTES.HOME} component={HomePage} />
				<Route path={ROUTES.ACCOUNT} component={AccountPage} />
				<Route path={ROUTES.ADMIN} component={AdminPage} />
			</div>
		</Router>
	</CookiesProvider>
);

export default compose(
	withTheme,
	useTheme,
	withAuthentication
)(App);
