import React from "react";

import * as ROUTES from "../../routes";
import { withRouter, RouterProps } from "react-router";
import Firebase, { withFirebase } from "../../context/firebase";
import { FaSignInAlt } from "react-icons/fa";

import "../../styles/nav/nav.scss";

interface NavigationProps extends RouterProps {
    firebase: Firebase;
}

const toggleMenu = () => {
    const x = document.getElementById("nav__menu") as HTMLElement;
    if (x.className === "nav__menu") {
        x.className += " nav__menu_expanded";
    } else {
        x.className = "nav__menu";
    }
};

const toggleAccountMenu = () => {
    const x = document.getElementById("nav__account-menu") as HTMLElement;
    if (x.className === "nav__account-menu") {
        x.className += " nav__account-menu_expanded";
    } else {
        x.className = "nav__account-menu";
    }
};

const Navigation: React.FC<NavigationProps> = (props) => (
    <div>
        <div className="nav">
            <button className="nav__menu-button" onClick={toggleMenu}>
                <p></p>
                <p></p>
                <p></p>
            </button>
            <button
                className="nav__logo"
                onClick={() => props.history.push(ROUTES.HOME)}
            >
                SDCalculator
            </button>
            {props.firebase.auth.currentUser ? (
                <button className="nav__avatar" onClick={toggleAccountMenu}>
                    <img
                        src={props.firebase.auth.currentUser.photoURL as string}
                        alt="avatar"
                    />
                </button>
            ) : (
                <button
                    className="nav__sign-in"
                    onClick={() => {
                        props.history.push(ROUTES.SIGN_IN);
                    }}
                >
                    <FaSignInAlt />
                </button>
            )}
        </div>
        <div className="nav__menu" id="nav__menu">
            <button
                className="nav__link"
                onClick={() => {
                    toggleMenu();
                    props.history.push(ROUTES.SETTINGS);
                }}
            >
                Settings
            </button>
            <button
                className="nav__link"
                onClick={() => {
                    toggleMenu();
                    props.history.push(ROUTES.ABOUT);
                }}
            >
                About
            </button>
        </div>
        <div className="nav__account-menu" id="nav__account-menu">
            <button
                className="nav__link"
                onClick={() => {
                    toggleAccountMenu();
                    props.history.push(ROUTES.ACCOUNT);
                }}
            >
                Preferences
            </button>
            <button
                className="nav__link"
                onClick={() => props.firebase.doSignOut() && toggleAccountMenu()}
            >
                Sign Out
            </button>
        </div>
    </div>
);

export default withRouter(withFirebase(Navigation));
