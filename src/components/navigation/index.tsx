import React, { useRef, useContext, useEffect, useState } from "react";

import * as ROUTES from "../../routes";
import { withRouter, __RouterContext } from "react-router";
import Firebase, { FirebaseContext } from "../../context/firebase";
import { FaSignInAlt } from "react-icons/fa";

import "../../styles/nav/nav.scss";
import { AuthUserContext } from "../../context/session";

const Navigation: React.FC = (_) => {
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const firebase = useContext(FirebaseContext) as Firebase;
    const user = useContext(AuthUserContext) as firebase.User | null;
    const router = useContext(__RouterContext);

    const [avatar, setAvatar] = useState<string>("");

    useEffect(() => {
        if (!user) return;
        setAvatar(user.photoURL as string);
    }, [user, user?.photoURL]);

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
                {router.location.pathname !== ROUTES.ACCOUNT ? (
                    user ? (
                        <button
                            className="nav__avatar"
                            onClick={toggleAccountMenu}
                        >
                            <img
                                src={avatar}
                                className="avatar avatar_small avatar_rounded"
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
                    )
                ) : null}
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
                    onClick={() => firebase.doSignOut() && toggleAccountMenu()}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default withRouter(Navigation);
