import { h } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import { TargetedEvent } from "preact/compat";
import * as ROUTES from "src/routes";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { LocalizationContext } from "src/context/localization";
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

    let isInvalid: boolean = email === "" || password === "";
    return (
        <div class="w-full h-screen flex flex-col align-middle justify-center items-center">
            <button
                onClick={signInWithFacebook}
                class="w-1/2 p-2 mb-2 bg-blue-500 hover:bg-blue-600 hover:border-blue-200 border-2 rounded-md flex gap-6 justify-start align-middle items-center text-white font-bold"
            >
                <span class="text-xl ml-6">
                    <FaFacebookF />
                </span>
                {localization.loginWith} Facebook
            </button>
            <button
                onClick={signInWithGoogle}
                class="w-1/2 p-2 mb-6 bg-red-500 hover:bg-red-600 hover:border-red-200 border-2 rounded-md flex gap-6 justify-start align-middle items-center text-white font-bold"
            >
                <span class="text-xl ml-6">
                    <FaGoogle />
                </span>
                {localization.loginWith} Google
            </button>
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
                        Your password
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

                <button
                    class="text-gray-400 hover:text-gray-500 mb-4 w-full text-left"
                    onClick={() => route(ROUTES.PASSWORD_FORGET)}
                >
                    {localization.forgotPassword}
                </button>
                <button
                    class="text-gray-400 hover:text-gray-500 mb-4 w-full text-left"
                    onClick={() => route(ROUTES.SIGN_UP)}
                >
                    {localization.signUp}
                </button>

                <button
                    disabled={isInvalid}
                    class="w-full border-2 rounded-md h-10 hover:bg-gray-300 bg-gray-200 disabled:bg-white"
                    type="submit"
                >
                    {localization.signIn}
                </button>

                <p class="pt-2 pb-4 text-red-500">{error}</p>
            </form>
        </div>
    );
};

export default SignIn;
