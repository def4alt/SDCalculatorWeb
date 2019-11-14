import React from "react";
import { withTheme } from "../Theme";
import { withAuthentication } from "../Session";
import { withLocalization, useLocalization } from "../Localization";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../../Constants/routes";

import Navigation from "../Navigation";
import SignUpPage from "../SignUp";
import BugsPage from "../Bugs";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";


interface AppProps {}

const App: React.FunctionComponent<AppProps> = props => (
	<CookiesProvider>
		<Router>
			<div className="root">
				<Navigation />
				<div className="base">
					<Route exact path={ROUTES.LANDING} component={SignInPage} />
					<Route path={ROUTES.SIGN_UP} component={SignUpPage} />
					<Route path={ROUTES.SIGN_IN} component={SignInPage} />
					<Route
						path={ROUTES.PASSWORD_FORGET}
						component={PasswordForgetPage}
					/>
					<Route path={ROUTES.HOME} component={HomePage} />
					<Route path={ROUTES.BUGS} component={BugsPage} />
					<Route path={ROUTES.ACCOUNT} component={AccountPage} />
					<Route path={ROUTES.ADMIN} component={AdminPage} />
				</div>
			</div>
		</Router>
	</CookiesProvider>
);

export default withTheme(
	withAuthentication(withLocalization(useLocalization(App)))
);
