import React, { useContext, useEffect, useRef, useState } from "react";

import * as ROUTES from "../../routes";
import { FiLogIn, FiUser } from "react-icons/fi";
import { LocalizationContext } from "Context/localization";

import "Styles/nav/nav.scss";
import { Link } from "react-router-dom";
import { supabase } from "Context/supabase/api";
import { UserContext } from "src/app";

const Navigation: React.FC = (_) => {
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { localization } = useContext(LocalizationContext);

    const [avatar, setAvatar] = useState<string>("");

    const user = useContext(UserContext);

    useEffect(() => {
        supabase.auth.onAuthStateChange((_, session) => {
            const new_user = session?.user;

            if (!new_user || !new_user.user_metadata.photo_url) {
                setAvatar("");
                return;
            }

            setAvatar(new_user.user_metadata.photo_url as string);
        });
    }, []);

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
                {user !== null ? (
                    <button
                        className="nav__avatar"
                        onClick={() =>
                            toggleMenu(
                                accountMenuRef,
                                "nav__account-menu_expanded"
                            )
                        }
                    >
                        {" "}
                        {avatar.length > 0 ? (
                            <img
                                src={avatar}
                                className="avatar avatar_rounded"
                                alt="avatar"
                            />
                        ) : (
                            <FiUser />
                        )}
                    </button>
                ) : (
                    <Link
                        className="nav__sign-in"
                        aria-label="Sign in"
                        to={ROUTES.SIGN_IN}
                    >
                        <FiLogIn />
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
                        supabase.auth.signOut();
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
