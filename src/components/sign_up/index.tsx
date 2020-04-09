import React, { useState, useContext } from "react";
import { withRouter, __RouterContext } from "react-router";
import * as ROUTES from "../../routes";
import Firebase, { FirebaseContext } from "../../context/firebase";

import "../../styles/form/form.scss";

const SignUp: React.FunctionComponent = (_) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string>("");

    const firebase = useContext(FirebaseContext) as Firebase;
    const router = useContext(__RouterContext);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        firebase
            .doCreateUserWithEmailAndPassword(email, password)
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
                <p>Username</p>
                <input
                    name="username"
                    onChange={onUsernameChange}
                    type="text"
                    placeholder="def4alt"
                />
            </div>
            <div className="form__input">
                <p>Email</p>
                <input
                    name="email"
                    onChange={onEmailChange}
                    type="email"
                    placeholder="example@example.com"
                />
            </div>
            <div className="form__input">
                <p>Password</p>
                <input
                    name="password"
                    onChange={onPasswordChange}
                    type="password"
                    placeholder="15%$vd09"
                />
            </div>
            <div className="form__input">
                <p>Password Confirm</p>
                <input
                    name="passwordConfirm"
                    onChange={onPasswordConfirmChange}
                    type="password"
                />
            </div>
            <button disabled={isInvalid} className="form__submit" type="submit">
                Sign In
            </button>

            <p className="form__error">{error}</p>
        </form>
    );
};

export default withRouter(SignUp);
