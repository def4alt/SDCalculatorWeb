import React, { useState, useContext } from "react";
import { withRouter, __RouterContext } from "react-router";
import * as ROUTES from "../../routes";
import Firebase, { FirebaseContext } from "../../context/firebase";
import { LocalizationContext } from "../../context/localization";

import "../../styles/form/form.scss";
import "../../styles/button/button.scss";

const SignUp: React.FunctionComponent = (_) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string>("");

    const firebase = useContext(FirebaseContext) as Firebase;
    const router = useContext(__RouterContext);
    const localization = useContext(LocalizationContext).localization;

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        firebase
            .createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return (
                    authUser.user &&
                    firebase.user(authUser.user.uid).set({ username, email })
                );
            })
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
        <form onSubmit={onSubmit} className="form">
            <div className="form__input">
                <p>{localization.username}</p>
                <input
                    name="username"
                    onChange={onUsernameChange}
                    type="text"
                    placeholder="def4alt"
                />
            </div>
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
            <div className="form__input">
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

            <p className="form__error">{error}</p>
        </form>
    );
};

export default withRouter(SignUp);
