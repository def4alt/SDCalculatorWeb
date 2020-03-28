import React from "react";

import "./navigation.scss";
import * as ROUTES from "../../routes";

interface NavigationProps {}

const toggleMenu = () => {
    const x = document.getElementById("myTopnav") as HTMLElement;
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
};

const Navigation: React.FC<NavigationProps> = props => (
    <div>
        <div id="nav">
            <button id="settings" onClick={toggleMenu}>
                <p></p>
                <p></p>
                <p></p>
            </button>
            <a id="logo" href={ROUTES.HOME}>
                SDCalculator
            </a>
        </div>
        <div className="topnav" id="myTopnav">
            <a className="link" href={ROUTES.LANDING}>
                About
            </a>
            <a className="link" href={ROUTES.BUGS}>
                Bugs
            </a>
            <a className="link" href={ROUTES.ACCOUNT}>
                Account
            </a>
            <a className="link" href={ROUTES.SIGN_IN}>
                Sign In
            </a>
            <a className="link" href={ROUTES.SIGN_UP}>
                Sign Up
            </a>
            <a className="link" href={ROUTES.ADMIN}>
                Control Panel
            </a>
        </div>
    </div>
);

export default Navigation;
