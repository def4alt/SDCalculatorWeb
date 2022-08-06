import { h } from "preact";
import { useContext } from "preact/hooks";
import { LocalizationContext } from "src/context/localization";

// TODO: Calculation type selection
const Settings = () => {
    const localization = useContext(LocalizationContext);

    return (
        <div class="w-full h-screen flex flex-col justify-center items-center gap-4">
            <div class="border-2 w-1/2 flex flex-col justify-center items-center p-4">
                <div class="w-full flex flex-col justify-center items-center gap-4">
                    <label class="text-lg w-full text-left">
                        {localization.localization.language}:
                    </label>
                    <button
                        class="w-full h-10 rounded-md bg-gray-100 hover:bg-gray-200"
                        onClick={() => localization.setLocale("en")}
                    >
                        English
                    </button>
                    <button
                        class="w-full h-10 rounded-md bg-gray-100 hover:bg-gray-200"
                        onClick={() => localization.setLocale("uk")}
                    >
                        Українська
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
