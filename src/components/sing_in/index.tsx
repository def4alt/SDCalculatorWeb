import React, { useState, useContext } from "react";
import { withRouter, RouterProps, __RouterContext } from "react-router";
import * as ROUTES from "../../routes";
import Firebase, { FirebaseContext } from "../../context/firebase";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { LocalizationContext } from "../../context/localization";

import "../../styles/form/form.scss";
import "../../styles/form/form__oauth/form__oauth.scss";
import "../../styles/button/button.scss";
import "../../styles/component/component.scss";

const SignIn: React.FunctionComponent = (_) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const firebase = useContext(FirebaseContext) as Firebase;
    const router = useContext(__RouterContext) as RouterProps;
    const localization = useContext(LocalizationContext).localization;

    const signInWithGoogle = () => {
        firebase
            .signInWithGoogle()
            .then(() => router.history.push(ROUTES.HOME));
    };
    const signInWithFacebook = () => {
        firebase
            .signInWithFacebook()
            .then(() => router.history.push(ROUTES.HOME));
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        firebase
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                router.history.push(ROUTES.HOME);
            })
            .catch((error) => {
                setError(error.message);
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
        <div className="form">
            <button
                onClick={signInWithFacebook}
                className="form__oauth form__oauth_fb"
            >
                <FaFacebookF className="icon" />
                {localization.loginWith} Facebook
            </button>
            <button
                onClick={signInWithGoogle}
                className="form__oauth form__oauth_gl"
            >
                <FaGoogle className="icon" />
                {localization.loginWith} Google
            </button>
            <form onSubmit={onSubmit}>
                <div className="form__input">
                    <p>{localization.email}</p>
                    <input
                        name="email"
                        onChange={onEmailChange}
                        type="email"
                        placeholder="example@example.com"
                    />
                </div>

                <div className="form__input">
                    <p>{localization.password}</p>
                    <input
                        name="password"
                        onChange={onPasswordChange}
                        type="password"
                        placeholder="15%$vd09"
                    />
                </div>

                <button
                    className="component__element button_link"
                    onClick={() => router.history.push(ROUTES.PASSWORD_FORGET)}
                >
                    {localization.forgotPassword}
                </button>
                <button
                    className="component__element button_link"
                    onClick={() => router.history.push(ROUTES.SIGN_UP)}
                >
                    {localization.signUp}
                </button>

                <button
                    disabled={isInvalid}
                    className="component__element button"
                    type="submit"
                >
                    {localization.signIn}
                </button>

                <p className="form__error">{error}</p>
            </form>
        </div>
    );
};

export default withRouter(SignIn);
