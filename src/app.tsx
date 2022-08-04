import React, { lazy, Suspense, useEffect, useState, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import * as ROUTES from "./routes";
import { withLocalization } from "./context/localization";
import Loading from "Components/loading";

import { supabase } from "Context/supabase/api";
import {  User } from "@supabase/supabase-js";

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

export const UserContext = createContext<User | null>(null);

const App: React.FC = (_) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const session = supabase.auth.session();

        setUser(session?.user ?? null);

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_, session) => {
                const currentUser = session?.user;
                setUser(currentUser ?? null);
            }
        );

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    return (
        <div className="root">
			<UserContext.Provider value={user}>            <Suspense fallback={<Loading />}>
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
            </Suspense></UserContext.Provider>
        </div>
    );
};

export default withLocalization(App);
