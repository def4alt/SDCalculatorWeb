import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import * as ROUTES from "../../routes";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { LocalizationContext } from "Context/localization";

import "Styles/auth/auth.scss";
import "Styles/auth/auth__oauth/auth__oauth.scss";
import "Styles/button/button.scss";
import { UserContext } from "src/app";
import { supabase } from "Context/supabase/api";

const SignIn: React.FunctionComponent = (_) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();
    const localization = useContext(LocalizationContext).localization;
    const user = useContext(UserContext);

    useEffect(() => {
        if (user !== null) navigate(ROUTES.HOME);
    }, []);

    const signInWithGoogle = () => {
        supabase.auth.signIn({ provider: "google" }).then((response) => {
            if (response.error === null) navigate(ROUTES.HOME);
            else setError(response.error.message);
        });
    };

    const signInWithFacebook = () => {
        supabase.auth.signIn({ provider: "facebook" }).then((response) => {
            if (response.error === null) navigate(ROUTES.HOME);
            else setError(response.error.message);
        });
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        supabase.auth.signIn({ email, password }).then((response) => {
            if (response.error === null) navigate(ROUTES.HOME);
            else setError(response.error.message);
        });
    };

    const onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    };

    const onEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value);
    };

    let isInvalid: boolean = email === "" && password === "";
    return (
        <div className="auth">
            <button
                onClick={signInWithFacebook}
                className="auth__oauth auth__oauth_fb"
            >
                <FaFacebookF className="icon" />
                {localization.loginWith} Facebook
            </button>
            <button
                onClick={signInWithGoogle}
                className="auth__oauth auth__oauth_gl"
            >
                <FaGoogle className="icon" />
                {localization.loginWith} Google
            </button>
            <form onSubmit={onSubmit}>
                <div className="auth__input">
                    <p>{localization.email}</p>
                    <input
                        name="email"
                        onChange={onEmailChange}
                        type="email"
                        placeholder="example@example.com"
                    />
                </div>

                <div className="auth__input">
                    <p>{localization.password}</p>
                    <input
                        name="password"
                        onChange={onPasswordChange}
                        type="password"
                        placeholder="15%$vd09"
                    />
                </div>

                <button
                    className="button_link"
                    onClick={() => navigate(ROUTES.PASSWORD_FORGET)}
                >
                    {localization.forgotPassword}
                </button>
                <button
                    className="button_link"
                    onClick={() => navigate(ROUTES.SIGN_UP)}
                >
                    {localization.signUp}
                </button>

                <button disabled={isInvalid} className="button" type="submit">
                    {localization.signIn}
                </button>

                <p className="auth__error">{error}</p>
            </form>
        </div>
    );
};

export default SignIn;
