import React from "react";
import { compose } from "recompose";
import { withTheme } from "../Theme";
import { withAuthentication } from "../Session";
import { withLocalization, useLocalization } from "../Localization";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../../Constants/routes";

import LandingPage from "../Landing";
import Navigation from "../Navigation";

interface AppProps {}

const App: React.FunctionComponent<AppProps> = props => (
	<CookiesProvider>
		<Router>
			<div className="root">
				<Navigation />
				<Route exact path={ROUTES.LANDING} component={LandingPage} />
			</div>
		</Router>
	</CookiesProvider>
);

export default compose(
	withTheme,
	withAuthentication,
	withLocalization,
	useLocalization
)(App);
