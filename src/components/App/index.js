import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import Navigation from "../Navigation";
import SignUpPage from "../SignUp";
import BugsPage from "../Bugs";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import LandingPage from "../Landing";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";

import * as ROUTES from "../../constants/routes";
import "./index.scss";

import { withAuthentication } from "../Session";
import { withTheme } from "../Theme";
import { compose } from "recompose";
import { withLocalization, useLocalization } from "../Localization";

const App = props => (
	<CookiesProvider>
		<Router>
			<div className="root">
				<Navigation />

				<Route
					render={({ history }) => (
						<div className="foundBug">
							<button onClick={() => history.push(ROUTES.BUGS)}>
								{props.strings.foundBug}
							</button>
						</div>
					)}
				/>

				<Route exact path={ROUTES.LANDING} component={LandingPage} />
				<Route path={ROUTES.SIGN_UP} component={SignUpPage} />
				<Route path={ROUTES.SIGN_IN} component={SignInPage} />
				<Route path={ROUTES.BUGS} component={BugsPage} />
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
	withLocalization,
	withAuthentication,
	useLocalization
)(App);
