import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "./routes";
import About from "./components/about";
import Home from "./components/home";
import SignUp from "./components/sign_up";
import SignIn from "./components/sing_in";
import Account from "./components/account";
import Navigation from "./components/navigation";
import PasswordForget from "./components/password_forget";
import { CookiesProvider } from "react-cookie";
import { withTheme } from "./context/theme";
import { withAuthentication } from "./context/session";
import { withLocalization } from "./context/localization";


const App: React.FC = _ => (
  <CookiesProvider>
    <Router>
      <div className="root">
        <Navigation />
        <Route exact path={ROUTES.HOME} component={Home} />
        <Route path={ROUTES.ABOUT} component={About} />
        <Route path={ROUTES.SIGN_UP} component={SignUp} />
        <Route path={ROUTES.SIGN_IN} component={SignIn} />
        <Route path={ROUTES.ACCOUNT} component={Account} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
      </div>
    </Router>
  </CookiesProvider>
);

export default withTheme(withAuthentication(withLocalization(App)));
