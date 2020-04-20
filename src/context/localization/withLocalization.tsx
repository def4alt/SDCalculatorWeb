import React, { useEffect } from "react";

import { LocalizationContext, localization } from "./index";

import { withCookies, ReactCookieProps } from "react-cookie";

const withLocalization = <P extends object>(
    Component: React.ComponentType<P>
) => {
    const WithLocalization: React.FC<P & ReactCookieProps> = (props) => {
        const setLocale = (code: string) => {
            props.cookies && props.cookies.set("lang", code, { path: "/" });
            localization.setLanguage(code);
        };

        useEffect(() => {
            if (props.cookies) {
                const lang = props.cookies.get("lang");

                if (!lang) return;

                localization.setLanguage(lang);
            }
        });

        return (
            <LocalizationContext.Provider value={{ localization, setLocale }}>
                <Component {...(props as P)} />
            </LocalizationContext.Provider>
        );
    };

    return withCookies(WithLocalization);
};

export default withLocalization;
