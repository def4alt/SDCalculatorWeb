import { h } from "preact";
import { useState, useContext } from "preact/hooks";
import { TargetedEvent } from "preact/compat";
import * as ROUTES from "src/routes";
import { LocalizationContext } from "src/context/localization";
import { supabase } from "src/context/supabase/api";
import { route } from "preact-router";

const SignUp: React.FunctionComponent = (_) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [error, setError] = useState<string>("");

    const localization = useContext(LocalizationContext).localization;

    const onSubmit = (event: TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();

        supabase.auth
            .signUp({ email, password })
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

    let isInvalid: boolean =
        email === "" ||
        password === "" ||
        password !== passwordConfirm ||
        password === "";
    return (
        <div class="w-full h-screen flex justify-center align-middle items-center">
            <form
                onSubmit={onSubmit}
                class="w-1/2 border-2 rounded-md p-2 pt-4"
            >
                <div class="mb-6 w-full">
                    <label
                        for="email"
                        class="block mb-2 text-sm w-full font-medium text-gray-900"
                    >
                        Your email
                    </label>
                    <input
                        type="email"
                        name="email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="name@example.com"
                        onChange={onEmailChange}
                        required
                    />
                </div>
                <div class="mb-6 w-full">
                    <label
                        for="password"
                        class="block mb-2 text-sm w-full font-medium text-gray-900"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="15%$vd09"
                        onChange={onPasswordChange}
                        required
                    />
                </div>
                <div class="mb-6 w-full">
                    <label
                        for="confirm-password"
                        class="block mb-2 text-sm w-full font-medium text-gray-900"
                    >
                        Confirm password
                    </label>
                    <input
                        type="password"
                        name="confirm-password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="15%$vd09"
                        onChange={onPasswordConfirmChange}
                        required
                    />
                </div>
                <button
                    disabled={isInvalid}
                    class="w-full border-2 rounded-md h-10 hover:bg-gray-300 bg-gray-200 disabled:bg-white"
                    type="submit"
                >
                    {localization.signUp}
                </button>

                <p className="auth__error">{error}</p>
            </form>
        </div>
    );
};

export default SignUp;
