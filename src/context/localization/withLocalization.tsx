import React, { useEffect } from "react";

import { LocalizationContext, localization } from "./index";

import { withCookies, ReactCookieProps } from "react-cookie";

const withLocalization = <P extends object>(
    Component: React.ComponentType<P>
) => {
    const WithLocalization: React.FC<P & ReactCookieProps> = (props) => {
        const setLocale = (code: string) => {
            localization.setLanguage(code);
            
            if (!props.cookies) return;
            props.cookies.set("lang", code, { path: "/" });
        };

        useEffect(() => {
            if (!props.cookies) return;

            const lang = props.cookies.get("lang");

            if (!lang) return;

            localization.setLanguage(lang);
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
