import React, { useState, useContext } from "react";
import Firebase, { FirebaseContext } from "Context/firebase";
import { LocalizationContext } from "Context/localization";

import "Styles/auth/auth.scss";
import "Styles/button/button.scss";

const PasswordForget: React.FC = (_) => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");

    const firebase = useContext(FirebaseContext) as Firebase;
    const localization = useContext(LocalizationContext).localization;

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        firebase
            .resetPassword(email)
            .then(() => {
                setEmail("");
                setError("");
            })
            .catch((error) => {
                setError(error);
            });
    };
    const onEmailChange = (event: React.FocusEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value);
    };

    let isInvalid = email === "";
    return (
        <form onSubmit={onSubmit} className="auth">
            <div className="auth__input">
                <p>{localization.email}</p>
                <input
                    name="email"
                    value={email}
                    onChange={onEmailChange}
                    type="text"
                    placeholder="example@example.com"
                />
            </div>
            <button className="button" disabled={isInvalid} type="submit">
                {localization.reset}
            </button>
            <p className="auth__error">{<p>{error}</p>}</p>
        </form>
    );
};
export default PasswordForget;
