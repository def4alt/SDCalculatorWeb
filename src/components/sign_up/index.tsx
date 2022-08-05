import { h } from "preact";
import { useState, useContext } from "preact/hooks";
import { TargetedEvent } from "preact/compat";
import * as ROUTES from "../../routes";
import { LocalizationContext } from "src/context/localization";

import "src/styles/auth/auth.scss";
import "src/styles/button/button.scss";
import { supabase } from "src/context/supabase/api";
import { route } from "preact-router";

const SignUp: React.FunctionComponent = (_) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string>("");

    const localization = useContext(LocalizationContext).localization;

    const onSubmit = (event: TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();

        supabase.auth
            .signUp({ email, password })
            .then(() => supabase.auth.update({ data: { username } }))
            .then(() => route(ROUTES.HOME))
            .catch((error: { message: string }) => setError(error.message));
    };
    const onPasswordChange = (event: TargetedEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    };
    const onPasswordConfirmChange = (
        event: TargetedEvent<HTMLInputElement>
    ) => {
        setPasswordConfirm(event.currentTarget.value);
    };
    const onEmailChange = (event: TargetedEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value);
    };
    const onUsernameChange = (event: TargetedEvent<HTMLInputElement>) => {
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
