import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import * as ROUTES from "./routes";
import { withAuthentication } from "./context/session";
import { withLocalization } from "./context/localization";
import withFirebase from "./context/firebase/withFirebase";
import { BrowserRouter as Router } from "react-router-dom";
import Loading from "Components/loading";

const About = lazy(() => import("Components/about"));
const Home = lazy(() => import(/* webpackPreload: true */ "Components/home"));
const Admin = lazy(() => import("Components/admin"));
const SignUp = lazy(() => import("Components/sign_up"));
const SignIn = lazy(() => import("Components/sign_in"));
const Account = lazy(() => import("Components/account"));
const Navigation = lazy(
    () => import(/* webpackPreload: true */ "Components/navigation")
);
const Settings = lazy(() => import("Components/settings"));
const PasswordForget = lazy(() => import("Components/password_forget"));

const App: React.FC = (_) => (
    <Router>
        <div className="root">
            <Suspense fallback={<Loading />}>
                <Navigation />
                <Route exact path={ROUTES.HOME} component={Home} />
                <Route path={ROUTES.ABOUT} component={About} />
                <Route path={ROUTES.SIGN_UP} component={SignUp} />
                <Route path={ROUTES.SIGN_IN} component={SignIn} />
                <Route path={ROUTES.ACCOUNT} component={Account} />
                <Route path={ROUTES.SETTINGS} component={Settings} />
                <Route path={ROUTES.ADMIN} component={Admin} />
                <Route
                    path={ROUTES.PASSWORD_FORGET}
                    component={PasswordForget}
                />
            </Suspense>
        </div>
    </Router>
);

export default withFirebase(withAuthentication(withLocalization(App)));
