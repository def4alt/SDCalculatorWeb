import React from "react";

import "./navigation.scss";
import * as ROUTES from "../../routes";
import { withRouter, RouterProps } from "react-router";
import Firebase, { withFirebase } from "../../context/firebase";
import { FaSignInAlt } from "react-icons/fa";

interface NavigationProps extends RouterProps {
    firebase: Firebase;
}

const toggleMenu = () => {
    const x = document.getElementById("myTopnav") as HTMLElement;
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
};

const toggleAvatar = () => {
    const x = document.getElementById("accountPopup") as HTMLElement;
    if (x.className === "accountPopup") {
        x.className += " responsive";
    } else {
        x.className = "accountPopup";
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
            {props.firebase.auth.currentUser ? (
                <button className="avatar" onClick={toggleAvatar}>
                    <img
                        src={props.firebase.auth.currentUser.photoURL as string}
                        alt="avatar"
                    />
                </button>
            ) : (
                <button
                    className="signinIcon"
                    onClick={() => {
                        props.history.push(ROUTES.SIGN_IN);
                    }}
                >
                    <FaSignInAlt />
                </button>
            )}
        </div>
        <div className="topnav" id="myTopnav">
            <button
                className="link"
                onClick={() => {
                    toggleMenu();
                    props.history.push(ROUTES.SETTINGS);
                }}
            >
                Settings
            </button>
            <button
                className="link"
                onClick={() => {
                    toggleMenu();
                    props.history.push(ROUTES.ABOUT);
                }}
            >
                About
            </button>
        </div>
        <div className="accountPopup" id="accountPopup">
            <button
                className="link"
                onClick={() => {
                    toggleAvatar();
                    props.history.push(ROUTES.ACCOUNT);
                }}
            >
                Preferences
            </button>
            <button
                className="link"
                onClick={() => props.firebase.doSignOut() && toggleAvatar()}
            >
                Sign Out
            </button>
        </div>
    </div>
);

export default withRouter(withFirebase(Navigation));
