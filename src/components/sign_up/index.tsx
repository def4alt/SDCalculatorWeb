import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import * as ROUTES from "../../routes";
import Firebase, { FirebaseContext } from "Context/firebase";
import { LocalizationContext } from "Context/localization";
import { updateProfile } from "firebase/auth";

import "Styles/auth/auth.scss";
import "Styles/button/button.scss";

const SignUp: React.FunctionComponent = (_) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string>("");

    const firebase = useContext(FirebaseContext) as Firebase;
    const localization = useContext(LocalizationContext).localization;
    const navigate = useNavigate();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        firebase
            .createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return (
                    authUser.user &&
                    updateProfile(authUser.user, { displayName: username })
                );
            })
            .then(() => navigate(ROUTES.HOME))
            .catch((error) => {
                setError(error.message);
            });
    };
    const onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    };
    const onPasswordConfirmChange = (
        event: React.FormEvent<HTMLInputElement>
    ) => {
        setPasswordConfirm(event.currentTarget.value);
    };
    const onEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value);
    };
    const onUsernameChange = (event: React.FormEvent<HTMLInputElement>) => {
        setUsername(event.currentTarget.value);
    };

    let isInvalid: boolean =
        email === "" ||
        password === "" ||
        password !== passwordConfirm ||
        password === "";
    return (
        <form onSubmit={onSubmit} className="auth">
            <div className="auth__input">
                <p>{localization.username}</p>
                <input
                    name="username"
                    onChange={onUsernameChange}
                    type="text"
                    placeholder="def4alt"
                />
            </div>
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
            <div className="auth__input">
                <p>{localization.passwordConfirm}</p>
                <input
                    name="passwordConfirm"
                    onChange={onPasswordConfirmChange}
                    type="password"
                />
            </div>
            <button disabled={isInvalid} className="button" type="submit">
                {localization.signUp}
            </button>

            <p className="auth__error">{error}</p>
        </form>
    );
};

export default SignUp;
