import React from "react";
import localization, { localizationTypeUnknown } from "./localization";

type LocalizationType = {
    setLocale: (code: string) => void;
    localization: localizationTypeUnknown;
};

const LocalizationContext = React.createContext<LocalizationType>({
    setLocale: (code: string) => localization.setLanguage(code),
    localization: localization,
});

export default LocalizationContext;
