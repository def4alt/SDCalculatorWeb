import React, { useContext, useEffect, useRef, useState } from "react";

import * as ROUTES from "../../routes";
import { FirebaseContext } from "Context/firebase";
import { FaSignInAlt } from "react-icons/fa";
import { AuthUserContext } from "Context/session";
import { LocalizationContext } from "Context/localization";

import "Styles/nav/nav.scss";
import Loading from "Components/loading";
import { Link } from "react-router-dom";

const Navigation: React.FC = (_) => {
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const firebase = useContext(FirebaseContext);
    const user = useContext(AuthUserContext);
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
                <Link className="nav__logo" to={ROUTES.HOME}>
                    SDCalculator
                </Link>
                {user ? (
                    avatar ? (
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
                        <Loading />
                    )
                ) : (
                    <Link
                        className="nav__sign-in"
                        aria-label="Sign in"
                        to={ROUTES.SIGN_IN}
                    >
                        <FaSignInAlt />
                    </Link>
                )}
            </div>
            <div className="nav__menu" ref={menuRef}>
                <Link
                    className="nav__link"
                    to={ROUTES.SETTINGS}
                    onClick={() => toggleMenu(menuRef, "nav__menu_expanded")}
                >
                    {localization.preferences}
                </Link>
                <Link
                    className="nav__link"
                    to={ROUTES.ABOUT}
                    onClick={() => toggleMenu(menuRef, "nav__menu_expanded")}
                >
                    {localization.about}
                </Link>
            </div>
            <div className="nav__account-menu" ref={accountMenuRef}>
                <Link
                    className="nav__link"
                    to={ROUTES.ACCOUNT}
                    onClick={() =>
                        toggleMenu(accountMenuRef, "nav__account-menu_expanded")
                    }
                >
                    {localization.accountSettings}
                </Link>
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

export default Navigation;
