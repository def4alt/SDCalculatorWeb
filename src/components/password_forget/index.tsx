import React, { useState, useContext } from "react";
import Firebase, { FirebaseContext } from "../../context/firebase";
import { LocalizationContext } from "../../context/localization";

import "../../styles/form/form.scss";
import "../../styles/button/button.scss";
import "../../styles/component/component.scss";

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
        <form onSubmit={onSubmit} className="form">
            <div className="form__input">
                <p>{localization.email}</p>
                <input
                    name="email"
                    value={email}
                    onChange={onEmailChange}
                    type="text"
                    placeholder="example@example.com"
                />
            </div>
            <button
                className="component__element button"
                disabled={isInvalid}
                type="submit"
            >
                {localization.reset}
            </button>
            <p className="form__error">{<p>{error}</p>}</p>
        </form>
    );
};
export default PasswordForget;
