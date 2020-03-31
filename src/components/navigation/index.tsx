import React from "react";

import "./navigation.scss";
import * as ROUTES from "../../routes";
import { withRouter, RouterProps } from "react-router";

interface NavigationProps extends RouterProps {}

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
            <button id="logo" onClick={() => props.history.push(ROUTES.HOME)}>
                SDCalculator
            </button>
        </div>
        <div className="topnav" id="myTopnav">
            <button
                className="link"
                onClick={() => props.history.push(ROUTES.HOME)}
            >
                Home
            </button>
            <button
                className="link"
                onClick={() => props.history.push(ROUTES.ABOUT)}
            >
                About
            </button>
            <button
                className="link"
                onClick={() => props.history.push(ROUTES.ACCOUNT)}
            >
                Account
            </button>
            <button
                className="link"
                onClick={() => props.history.push(ROUTES.SIGN_IN)}
            >
                Sign In
            </button>
            <button
                className="link"
                onClick={() => props.history.push(ROUTES.ADMIN)}
            >
                Control Panel
            </button>
        </div>
    </div>
);

export default withRouter(Navigation);
