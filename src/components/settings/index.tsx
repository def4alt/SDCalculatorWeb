import React, { useContext } from "react";
import { LocalizationContext } from "../../context/localization";

import "../../styles/button/button.scss";

// TODO: Calculation type selection
const Settings: React.FC = (_) => {
    const localization = useContext(LocalizationContext);

    return (
        <div>
            <div>
                {localization.localization.language}:
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
        </div>
    );
};

export default Settings;
