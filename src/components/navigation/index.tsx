import React, { useRef, useContext, useEffect, useState } from "react";

import * as ROUTES from "../../routes";
import { withRouter, __RouterContext } from "react-router";
import Firebase, { FirebaseContext } from "../../context/firebase";
import { FaSignInAlt } from "react-icons/fa";
import { AuthUserContext } from "../../context/session";
import { LocalizationContext } from "../../context/localization";

import "../../styles/nav/nav.scss";

const Navigation: React.FC = (_) => {
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const firebase = useContext(FirebaseContext) as Firebase;
    const user = useContext(AuthUserContext) as firebase.User | null;
    const router = useContext(__RouterContext);
    const localization = useContext(LocalizationContext).localization;

    const [avatar, setAvatar] = useState<string>("");

    useEffect(() => {
        if (!user) return;
        setAvatar(user.photoURL as string);
    }, [user, user?.photoURL]);

    const toggleMenu = (
        ref: React.RefObject<HTMLElement>,
        className: string
    ) => {
        const menu = ref.current;

        if (!menu) return;

        if (!menu.classList.contains(className)) menu.classList.add(className);
        else menu.classList.remove(className);
    };

    return (
        <div>
            <div className="nav">
                <button
                    className="nav__menu-button"
                    onClick={() => toggleMenu(menuRef, "nav__menu_expanded")}
                >
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
                            onClick={() =>
                                toggleMenu(
                                    accountMenuRef,
                                    "nav__account-menu_expanded"
                                )
                            }
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
                        toggleMenu(menuRef, "nav__menu_expanded");
                        router.history.push(ROUTES.SETTINGS);
                    }}
                >
                    {localization.preferences}
                </button>
                <button
                    className="nav__link"
                    onClick={() => {
                        toggleMenu(menuRef, "nav__menu_expanded");
                        router.history.push(ROUTES.ABOUT);
                    }}
                >
                    {localization.about}
                </button>
            </div>
            <div className="nav__account-menu" ref={accountMenuRef}>
                <button
                    className="nav__link"
                    onClick={() => {
                        toggleMenu(
                            accountMenuRef,
                            "nav__account-menu_expanded"
                        );
                        router.history.push(ROUTES.ACCOUNT);
                    }}
                >
                    {localization.accountSettings}
                </button>
                <button
                    className="nav__link"
                    onClick={() =>
                        firebase.doSignOut() &&
                        toggleMenu(accountMenuRef, "nav__account-menu_expanded")
                    }
                >
                    {localization.signOut}
                </button>
            </div>
        </div>
    );
};

export default withRouter(Navigation);
