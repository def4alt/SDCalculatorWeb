import React, { useContext } from "react";
import { LocalizationContext } from "Context/localization";

import "Styles/button/button.scss";
import "Styles/settings/settings.scss";

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
