import { h } from "preact";
import { useState, useContext } from "preact/hooks";
import { TargetedEvent } from "preact/compat";
import { LocalizationContext } from "src/context/localization";

import "src/styles/auth/auth.scss";
import "src/styles/button/button.scss";
import { supabase } from "src/context/supabase/api";

const PasswordForget: React.FC = (_) => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");

    const localization = useContext(LocalizationContext).localization;

    const onSubmit = (event: TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();

        supabase.auth.api
            .resetPasswordForEmail(email)
            .then(() => {
                setEmail("");
                setError("");
            })
            .catch((error) => setError(error));
    };
    const onEmailChange = (event: TargetedEvent<HTMLInputElement, Event>) => {
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
