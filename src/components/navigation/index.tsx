import { Fragment, h } from "preact";
import { useRef, useState, useContext, useEffect } from "preact/hooks";
import * as ROUTES from "src/routes";
import { FaRegCaretSquareRight, FaRegUser } from "react-icons/fa";
import { LocalizationContext } from "src/context/localization";

import "src/styles/nav/nav.scss";
import { route } from "preact-router";
import { supabase } from "src/context/supabase/api";
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
        <Fragment>
            <div class="nav">
                <button
                    class="nav__menu-button"
                    aria-label="Menu toggle"
                    onClick={() => toggleMenu(menuRef, "nav__menu_expanded")}
                >
                    <p />
                    <p />
                    <p />
                </button>
                <button class="nav__logo" onClick={() => route(ROUTES.HOME)}>
                    SDCalculator
                </button>
                {user !== null ? (
                    <button
                        class="nav__avatar"
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
                                class="avatar avatar_rounded"
                                alt="avatar"
                            />
                        ) : (
                            <FaRegUser />
                        )}
                    </button>
                ) : (
                    <button
                        class="nav__sign-in"
                        aria-label="Sign in"
                        onClick={() => route(ROUTES.SIGN_IN)}
                    >
                        <FaRegCaretSquareRight />
                    </button>
                )}
            </div>
            <div class="nav__menu" ref={menuRef}>
                <button
                    class="nav__link"
                    onClick={() => {
                        toggleMenu(menuRef, "nav__menu_expanded");
                        route(ROUTES.SETTINGS);
                    }}
                >
                    {localization.preferences}
                </button>
                <button
                    class="nav__link"
                    onClick={() => {
                        toggleMenu(menuRef, "nav__menu_expanded");
                        route(ROUTES.ABOUT);
                    }}
                >
                    {localization.about}
                </button>
            </div>
            <div class="nav__account-menu" ref={accountMenuRef}>
                <button
                    class="nav__link"
                    onClick={() => {
                        route(ROUTES.ACCOUNT);
                        toggleMenu(
                            accountMenuRef,
                            "nav__account-menu_expanded"
                        );
                    }}
                >
                    {localization.accountSettings}
                </button>
                <button
                    class="nav__link"
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
        </Fragment>
    );
};

export default Navigation;
