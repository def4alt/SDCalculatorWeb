import React, { useContext, useEffect, useRef, useState } from "react";

import * as ROUTES from "../../routes";
import { __RouterContext, withRouter } from "react-router";
import { FirebaseContext } from "Context/firebase";
import { FaSignInAlt } from "react-icons/fa";
import { AuthUserContext } from "Context/session";
import { LocalizationContext } from "Context/localization";

import "Styles/nav/nav.scss";

const Navigation: React.FC = (_) => {
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const firebase = useContext(FirebaseContext);
    const user = useContext(AuthUserContext);
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
        <>
            <div className="nav">
                <button
                    className="nav__menu-button"
                    aria-label="Menu toggle"
                    onClick={() => toggleMenu(menuRef, "nav__menu_expanded")}
                >
                    <p />
                    <p />
                    <p />
                </button>
                <button
                    className="nav__logo"
                    onClick={() => router.history.push(ROUTES.HOME)}
                >
                    SDCalculator
                </button>
                {user ? (
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
                            className="avatar avatar_rounded"
                            alt="avatar"
                        />
                    </button>
                ) : (
                    <button
                        className="nav__sign-in"
                        aria-label="Sign in"
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
                    onClick={() => {
                        if (!firebase) return;
                        firebase.signOut();
                        toggleMenu(
                            accountMenuRef,
                            "nav__account-menu_expanded"
                        );
                    }}
                >
                    {localization.signOut}
                </button>
            </div>
        </>
    );
};

export default withRouter(Navigation);
