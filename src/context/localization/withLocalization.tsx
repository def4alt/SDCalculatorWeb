import React from "react";

import { LocalizationContext, localization } from "./index";

import { withCookies, ReactCookieProps } from "react-cookie";
import { LocalizedStringsMethods } from "react-localization";

type withLocalizationState = {
  setLocale: (code: string) => void;
  localization: LocalizedStringsMethods;
};

const withLocalization = <P extends object>(
  Component: React.ComponentType<P>
) => {
  class WithLocalization extends React.Component<
    P & ReactCookieProps,
    withLocalizationState
  > {
    constructor(props: P & ReactCookieProps) {
      super(props);
      this.setLocale = this.setLocale.bind(this);

      this.state = {
        localization: localization,
        setLocale: this.setLocale
      };
    }

    setLocale(code: string) {
      this.props.cookies && this.props.cookies.set("lang", code, { path: "/" });
      this.state.localization.setLanguage(code);
      this.setState({});
    }

    componentDidMount() {
      if (this.props.cookies) {
        const lang: string = this.props.cookies.get("lang");
        if (lang) this.state.localization.setLanguage(lang);
      }
    }

    render() {
      return (
        <LocalizationContext.Provider value={this.state}>
          <Component {...(this.props as P)} />
        </LocalizationContext.Provider>
      );
    }
  }

  return withCookies(WithLocalization);
};

export default withLocalization;
