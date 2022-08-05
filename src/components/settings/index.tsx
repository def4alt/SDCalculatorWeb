import { h } from "preact";
import { useContext } from "preact/hooks";
import { LocalizationContext } from "src/context/localization";

import "src/styles/button/button.scss";
import "src/styles/settings/settings.scss";

// TODO: Calculation type selection
const Settings: React.FC = (_) => {
    const localization = useContext(LocalizationContext);

    return (
        <div className="settings">
            <p>{localization.localization.language}:</p>
            <button
                className="button_link"
                onClick={() => localization.setLocale("en")}
            >
                English
            </button>
            <button
                className="button_link"
                onClick={() => localization.setLocale("ru")}
            >
                Русский
            </button>
            <button
                className="button_link"
                onClick={() => localization.setLocale("uk")}
            >
                Українська
            </button>
        </div>
    );
};

export default Settings;
