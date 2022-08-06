import React from "react";
import localization, { LocalizationType } from "./localization";

type ContextType = {
    setLocale: (code: string) => void;
    localization: LocalizationType;
};

const LocalizationContext = React.createContext<ContextType>({
    setLocale: (code: string) => localization.setLanguage(code),
    localization: localization,
});

export default LocalizationContext;
