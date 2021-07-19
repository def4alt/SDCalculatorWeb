import React from "react";
import { Route } from "react-router-dom";
import * as ROUTES from "./routes";
import About from "./components/about";
import Home from "./components/home";
import Admin from "./components/admin";
import SignUp from "./components/sign_up";
import SignIn from "./components/sing_in";
import Account from "./components/account";
import Navigation from "./components/navigation";
import Settings from "./components/settings";
import PasswordForget from "./components/password_forget";
import { withAuthentication } from "./context/session";
import { withLocalization } from "./context/localization";
import withFirebase from "./context/firebase/withFirebase";
import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = (_) => (
    <Router>
        <div className="root">
            <Navigation />
            <Route exact path={ROUTES.HOME} component={Home} />
            <Route path={ROUTES.ABOUT} component={About} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
            <Route path={ROUTES.SIGN_IN} component={SignIn} />
            <Route path={ROUTES.ACCOUNT} component={Account} />
            <Route path={ROUTES.SETTINGS} component={Settings} />
            <Route path={ROUTES.ADMIN} component={Admin} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
        </div>
    </Router>
);

export default withFirebase(withAuthentication(withLocalization(App)));
