import React from "react";
import { LocalizedStringsMethods } from "react-localization";
import strings from "./localization";

type LocalizationType = {
    setLocale: (code: string) => void;
    strings: LocalizedStringsMethods;
}

const LocalizationContext = React.createContext<LocalizationType>({setLocale: (_: string) => null, strings: strings});

export default LocalizationContext;