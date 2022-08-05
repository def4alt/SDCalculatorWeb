import { h } from "preact";
import { createContext } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import * as ROUTES from "./routes";
import { localization, LocalizationContext } from "src/context/localization";
import { StrictMode } from "preact/compat";
import { CookiesProvider } from "react-cookie";

import { supabase } from "src/context/supabase/api";
import { User } from "@supabase/supabase-js";
import { useCookies } from "react-cookie";
import { Router, Route } from "preact-router";
import Navigation from "./components/navigation";
import Home from "./components/home";
import About from "./components/about";
import SignUp from "./components/sign_up";
import SignIn from "./components/sign_in";
import Account from "./components/account";
import Settings from "./components/settings";
import Admin from "./components/admin";
import PasswordForget from "./components/password_forget";

export const UserContext = createContext<User | null>(null);

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [cookies, setCookie] = useCookies(["lang"]);

    const setLocale = (code: string) => {
        localization.setLanguage(code);

        if (!cookies) return;
        setCookie("lang", code, { path: "/" });
    };

    useEffect(() => {
        if (!cookies) return;

        const lang = cookies.lang;

        if (!lang) return;

        localization.setLanguage(lang);
    });

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
        <StrictMode>
            <div id="app">
                <CookiesProvider>
                    <LocalizationContext.Provider
                        value={{ localization, setLocale }}
                    >
                        <UserContext.Provider value={user}>
                            {" "}
                            <Navigation />
                            <Router>
                                <Route path={ROUTES.HOME} component={Home} />
                                <Route path={ROUTES.ABOUT} component={About} />
                                <Route
                                    path={ROUTES.SIGN_UP}
                                    component={SignUp}
                                />
                                <Route
                                    path={ROUTES.SIGN_IN}
                                    component={SignIn}
                                />
                                <Route
                                    path={ROUTES.ACCOUNT}
                                    component={Account}
                                />
                                <Route
                                    path={ROUTES.SETTINGS}
                                    component={Settings}
                                />
                                <Route path={ROUTES.ADMIN} component={Admin} />
                                <Route
                                    path={ROUTES.PASSWORD_FORGET}
                                    component={PasswordForget}
                                />
                            </Router>
                        </UserContext.Provider>
                    </LocalizationContext.Provider>
                </CookiesProvider>
            </div>
        </StrictMode>
    );
};

export default App;
