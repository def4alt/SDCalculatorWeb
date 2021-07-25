import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import * as ROUTES from "./routes";
import About from "Components/about";
import Home from "Components/home";
import Admin from "Components/admin";
import SignUp from "Components/sign_up";
import SignIn from "Components/sing_in";
import Account from "Components/account";
import Navigation from "Components/navigation";
import Settings from "Components/settings";
import PasswordForget from "Components/password_forget";
import { withAuthentication } from "./context/session";
import { withLocalization } from "./context/localization";
import withFirebase from "./context/firebase/withFirebase";
import { BrowserRouter as Router } from "react-router-dom";
import Loading from "Components/loading";

const App: React.FC = (_) => (
    <Router>
        <div className="root">
            <Suspense fallback={<Loading />}>
                <Navigation />
            </Suspense>
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
