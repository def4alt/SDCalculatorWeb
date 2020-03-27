import LocalizedStrings, { LocalizedStringsMethods } from "react-localization";

export interface localizationTypeUnknown extends LocalizedStringsMethods {}

var localization: LocalizedStringsMethods = new LocalizedStrings({
  en: {},
  ru: {},
  uk: {}
});

export default localization;
