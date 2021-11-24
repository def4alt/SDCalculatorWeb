import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
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
    <div className="root">
        <Suspense fallback={<Loading />}>
            <Navigation />
            <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.ABOUT} element={<About />} />
                <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
                <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
                <Route path={ROUTES.ACCOUNT} element={<Account />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
                <Route path={ROUTES.ADMIN} element={<Admin />} />
                <Route
                    path={ROUTES.PASSWORD_FORGET}
                    element={<PasswordForget />}
                />
            </Routes>
        </Suspense>
    </div>
);

export default withFirebase(withAuthentication(withLocalization(App)));
