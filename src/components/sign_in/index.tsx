import { h } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import { TargetedEvent } from "preact/compat";
import * as ROUTES from "../../routes";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { LocalizationContext } from "src/context/localization";

import "src/styles/auth/auth.scss";
import "src/styles/auth/auth__oauth/auth__oauth.scss";
import "src/styles/button/button.scss";
import { UserContext } from "src/app";
import { supabase } from "src/context/supabase/api";
import { route } from "preact-router";

const SignIn: React.FunctionComponent = (_) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const localization = useContext(LocalizationContext).localization;
    const user = useContext(UserContext);

    useEffect(() => {
        if (user !== null) route(ROUTES.HOME);
    }, []);

    const signInWithGoogle = () => {
        supabase.auth.signIn({ provider: "google" }).then((response) => {
            if (response.error === null) route(ROUTES.HOME);
            else setError(response.error.message);
        });
    };

    const signInWithFacebook = () => {
        supabase.auth.signIn({ provider: "facebook" }).then((response) => {
            if (response.error === null) route(ROUTES.HOME);
            else setError(response.error.message);
        });
    };

    const onSubmit = (event: TargetedEvent<HTMLFormElement>) => {
        event.preventDefault();

        supabase.auth.signIn({ email, password }).then((response) => {
            if (response.error === null) route(ROUTES.HOME);
            else setError(response.error.message);
        });
    };

    const onPasswordChange = (event: TargetedEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    };

    const onEmailChange = (event: TargetedEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value);
    };

    let isInvalid: boolean = email === "" && password === "";
    return (
        <div class="auth">
            <button
                onClick={signInWithFacebook}
                class="auth__oauth auth__oauth_fb"
            >
                <FaFacebookF />
                {localization.loginWith} Facebook
            </button>
            <button
                onClick={signInWithGoogle}
                class="auth__oauth auth__oauth_gl"
            >
                <FaGoogle />
                {localization.loginWith} Google
            </button>
            <form onSubmit={onSubmit}>
                <div class="auth__input">
                    <p>{localization.email}</p>
                    <input
                        name="email"
                        onChange={onEmailChange}
                        type="email"
                        placeholder="example@example.com"
                    />
                </div>

                <div class="auth__input">
                    <p>{localization.password}</p>
                    <input
                        name="password"
                        onChange={onPasswordChange}
                        type="password"
                        placeholder="15%$vd09"
                    />
                </div>

                <button
                    class="button_link"
                    onClick={() => route(ROUTES.PASSWORD_FORGET)}
                >
                    {localization.forgotPassword}
                </button>
                <button
                    class="button_link"
                    onClick={() => route(ROUTES.SIGN_UP)}
                >
                    {localization.signUp}
                </button>

                <button disabled={isInvalid} class="button" type="submit">
                    {localization.signIn}
                </button>

                <p class="auth__error">{error}</p>
            </form>
        </div>
    );
};

export default SignIn;
