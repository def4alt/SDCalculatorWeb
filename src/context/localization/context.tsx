import React from "react";
import { LocalizedStringsMethods } from "react-localization";
import localization from "./localization";

type LocalizationType = {
  setLocale: (code: string) => void;
  localization: LocalizedStringsMethods;
};

const LocalizationContext = React.createContext<LocalizationType>({
  setLocale: (code: string) => null,
  localization: localization
});

export default LocalizationContext;
