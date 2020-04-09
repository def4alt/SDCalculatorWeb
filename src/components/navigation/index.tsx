import React, { useRef, useContext } from "react";

import * as ROUTES from "../../routes";
import { withRouter, __RouterContext } from "react-router";
import Firebase, { FirebaseContext } from "../../context/firebase";
import { FaSignInAlt } from "react-icons/fa";

import "../../styles/nav/nav.scss";

const Navigation: React.FC = _ => {
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    
    const firebase = useContext(FirebaseContext) as Firebase;
    const router = useContext(__RouterContext);

    const toggleAccountMenu = () => {
        const accountMenu = accountMenuRef.current;

        if (!accountMenu) return;

        if (accountMenu.className === "nav__account-menu") {
            accountMenu.className += " nav__account-menu_expanded";
        } else {
            accountMenu.className = "nav__account-menu";
        }
    };
    const toggleMenu = () => {
        const menu = menuRef.current;

        if (!menu) return;

        if (menu.className === "nav__menu") {
            menu.className += " nav__menu_expanded";
        } else {
            menu.className = "nav__menu";
        }
    };

    return (
        <div>
            <div className="nav">
                <button className="nav__menu-button" onClick={toggleMenu}>
                    <p></p>
                    <p></p>
                    <p></p>
                </button>
                <button
                    className="nav__logo"
                    onClick={() => router.history.push(ROUTES.HOME)}
                >
                    SDCalculator
                </button>
                {firebase.auth.currentUser ? (
                    <button className="nav__avatar" onClick={toggleAccountMenu}>
                        <img
                            src={
                                firebase.auth.currentUser
                                    .photoURL as string
                            }
                            alt="avatar"
                        />
                    </button>
                ) : (
                    <button
                        className="nav__sign-in"
                        onClick={() => {
                            router.history.push(ROUTES.SIGN_IN);
                        }}
                    >
                        <FaSignInAlt />
                    </button>
                )}
            </div>
            <div className="nav__menu" ref={menuRef}>
                <button
                    className="nav__link"
                    onClick={() => {
                        toggleMenu();
                        router.history.push(ROUTES.SETTINGS);
                    }}
                >
                    Settings
                </button>
                <button
                    className="nav__link"
                    onClick={() => {
                        toggleMenu();
                        router.history.push(ROUTES.ABOUT);
                    }}
                >
                    About
                </button>
            </div>
            <div className="nav__account-menu" ref={accountMenuRef}>
                <button
                    className="nav__link"
                    onClick={() => {
                        toggleAccountMenu();
                        router.history.push(ROUTES.ACCOUNT);
                    }}
                >
                    Preferences
                </button>
                <button
                    className="nav__link"
                    onClick={() =>
                        firebase.doSignOut() && toggleAccountMenu()
                    }
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default withRouter(Navigation);
