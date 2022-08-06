import { h } from "preact";
import { useState, useContext } from "preact/hooks";
import { TargetedEvent } from "preact/compat";
import { LocalizationContext } from "src/context/localization";
import { supabase } from "src/context/supabase/api";

const PasswordForget: React.FC = (_) => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    const localization = useContext(LocalizationContext).localization;

    const onSubmit = (event: TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();

        supabase.auth.api.resetPasswordForEmail(email).then((response) => {
            if (response.error) setError(response.error.message);
            else {
                setEmail("");
                setError("");
                setSuccess(true);
            }
        });
    };
    const onEmailChange = (event: TargetedEvent<HTMLInputElement, Event>) => {
        setEmail(event.currentTarget.value);
    };

    let isInvalid = email === "";
    return (
        <div class="flex flex-col justify-center align-middle items-center h-screen w-full">
            <form
                onSubmit={onSubmit}
                class="w-1/2 p-2 pt-4 border-2 rounded-md"
            >
                <div>
                    <label
                        for="email"
                        class="block mb-2 text-sm w-full font-medium text-gray-900"
                    >
                        {localization.email}
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
                <p class="py-5 text-green-500">
                    {success ? localization.recoveryLinkWasSent : ""}
                </p>

                <button
                    disabled={isInvalid}
                    class="w-full border-2 rounded-md h-10 hover:bg-gray-300 bg-gray-200 disabled:bg-white"
                    type="submit"
                >
                    {localization.reset}
                </button>
                <p className="py-2 text-red-500">{<p>{error}</p>}</p>
            </form>
        </div>
    );
};
export default PasswordForget;
