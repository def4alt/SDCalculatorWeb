import { LocalizationContext, localizationType } from "./index";
import React from "react";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type useLocalizationProps = {
  localization: localizationType;
  setLocale: (code: string) => void;
};

const useLocalization = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, keyof useLocalizationProps>> => props => (
  <LocalizationContext.Consumer>
    {({ localization, setLocale }) => (
      <Component
        {...(props as P)}
        localization={localization as localizationType}
        setLocale={setLocale}
      />
    )}
  </LocalizationContext.Consumer>
);

export default useLocalization;
