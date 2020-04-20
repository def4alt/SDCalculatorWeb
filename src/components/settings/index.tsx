import React, { useContext } from "react";
import "../../styles/component/component.scss";
import "../../styles/button/button.scss";
import { LocalizationContext } from "../../context/localization";

// TODO: Calculation type selection
const Settings: React.FC = (_) => {
    const localization = useContext(LocalizationContext);

    return (
        <div className="component component_centered">
            <div className="component__element component__element_centered">
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
