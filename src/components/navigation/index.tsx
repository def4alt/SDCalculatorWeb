import React from "react";

import { ThemeContext } from "../../context/theme";
import {
  LocalizationContext,
  localizationType
} from "../../context/localization";
import { AuthUserContext } from "../../context/session";

import * as ROUTES from "../../routes";

import { WiDaySunny, WiNightClear } from "react-icons/wi";

import "./navigation.scss";

const Navigation: React.SFC = () => (
  <div>
    <LocalizationContext.Consumer>
      {({ localization, setLocale }) => (
        <ThemeContext.Consumer>
          {({ isDark, toggleTheme }) => (
            <AuthUserContext.Consumer>
              {authUser =>
                authUser ? (
                  <NavigationAuth
                    theme={{ isDark, toggleTheme }}
                    localization={localization as localizationType}
                    setLocale={setLocale}
                  />
                ) : (
                  <NavigationNonAuth
                    theme={{ isDark, toggleTheme }}
                    localization={localization as localizationType}
                    setLocale={setLocale}
                  />
                )
              }
            </AuthUserContext.Consumer>
          )}
        </ThemeContext.Consumer>
      )}
    </LocalizationContext.Consumer>
  </div>
);

interface NavigationProps {
  theme: {
    isDark: boolean;
    toggleTheme: () => void;
  };
  localization: localizationType;
  setLocale: (code: string) => void;
}

const NavigationAuth: React.SFC<NavigationProps> = props => (
  <div className="nav">
    <input type="checkbox" id="nav-check" />
    <div className="nav-brand">
      <a href={ROUTES.LANDING}>SDCalculatorWeb</a>
    </div>
    <div className="nav-links">
      <a href={ROUTES.HOME}>Home</a>
      <a href={ROUTES.ACCOUNT}>Account</a>
    </div>
    <div className="locale">
      <button onClick={() => props.setLocale("en")}>En</button>
      <button onClick={() => props.setLocale("ru")}>Ru</button>
      <button onClick={() => props.setLocale("uk")}>Uk</button>
    </div>
    <div className="theme">
      <button onClick={() => props.theme.toggleTheme()}>
        {!props.theme.isDark ? <WiNightClear /> : <WiDaySunny />}
      </button>
    </div>
    <div className="signOut">
        Sigh Out
    </div>
    <div className="nav-btn">
      <label htmlFor="nav-check">
        <span></span>
        <span></span>
        <span></span>
      </label>
    </div>
  </div>
);

const NavigationNonAuth: React.SFC<NavigationProps> = props => (
  <div className="nav">
    <input type="checkbox" id="nav-check" />
    <div className="nav-brand">
      <a href={ROUTES.LANDING}>SDCalculatorWeb</a>
    </div>
    <div className="nav-links">
      <a href={ROUTES.HOME}>Home</a>
      <a href={ROUTES.SIGN_IN}>Sign In</a>
    </div>
    <div className="locale">
      <button onClick={() => props.setLocale("en")}>En</button>
      <button onClick={() => props.setLocale("ru")}>Ru</button>
      <button onClick={() => props.setLocale("uk")}>Uk</button>
    </div>
    <div className="theme">
      <button onClick={() => props.theme.toggleTheme()}>
        {!props.theme.isDark ? <WiNightClear /> : <WiDaySunny />}
      </button>
    </div>
    <div className="nav-btn">
      <label htmlFor="nav-check">
        <span></span>
        <span></span>
        <span></span>
      </label>
    </div>
  </div>
);

export default Navigation;
