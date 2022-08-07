import { Fragment, h } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import * as ROUTES from "src/routes";
import { FaBars, FaRegCaretSquareRight, FaRegUser } from "react-icons/fa";
import { LocalizationContext } from "src/context/localization";
import { route } from "preact-router";
import { supabase } from "src/context/supabase/api";
import { UserContext } from "src/app";

const Navigation: React.FC = (_) => {
    const { localization } = useContext(LocalizationContext);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showAccount, setShowAccount] = useState<boolean>(false);
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

    return (
        <Fragment>
            <div class="fixed z-20 bg-white flex items-center justify-around w-screen shadow-md h-14 rounded-b-md print:hidden">
                <button
                    class="w-1/4 md:1/3 h-10 text-lg rounded-md inline-flex justify-center items-center hover:bg-gray-100"
                    aria-label="Menu toggle"
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <FaBars />
                </button>
                <button
                    class="h-10 w-1/3 sm:w-1/4 text-base xs:text-xl rounded-md hover:bg-gray-100 hover:cursor-pointer"
                    onClick={() => route(ROUTES.HOME)}
                >
                    SDCalculator
                </button>
                {user !== null ? (
                    <button
                        class="w-1/4 h-10 text-lg rounded-md inline-flex justify-center items-center hover:bg-gray-100"
                        onClick={() => setShowAccount(!showAccount)}
                    >
                        {" "}
                        {avatar.length > 0 ? (
                            <img src={avatar} alt="avatar" />
                        ) : (
                            <FaRegUser />
                        )}
                    </button>
                ) : (
                    <button
                        class="w-1/4 h-10 text-lg rounded-md inline-flex justify-center items-center hover:bg-gray-100"
                        aria-label="Sign in"
                        onClick={() => route(ROUTES.SIGN_IN)}
                    >
                        <FaRegCaretSquareRight />
                    </button>
                )}
            </div>

            <div
                class={`fixed mt-14 z-10 h-screen w-screen md:w-1/3 flex flex-col ease-in-out duration-300 justify-start items-start gap-2 bg-white rounded-rb-md p-4 shadow-md ${
                    showSettings ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <button
                    class="w-full text-center bg-gray-100 h-10 p-2 rounded-md hover:cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                        route(ROUTES.SETTINGS);
                        setShowSettings(!showSettings);
                    }}
                >
                    {localization.settings}
                </button>
                <button
                    class="w-full text-center bg-gray-100 h-10 p-2 rounded-md hover:cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                        route(ROUTES.ABOUT);
                        setShowSettings(!showSettings);
                    }}
                >
                    {localization.about}
                </button>
            </div>
            <div
                class={`fixed right-0 mt-14 z-10 h-screen w-screen md:w-1/3 flex flex-col ease-in-out duration-300 justify-start items-start gap-2 bg-white rounded-rb-md p-4 shadow-md ${
                    showAccount ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <button
                    class="w-full text-center bg-gray-100 h-10 p-2 rounded-md hover:cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                        route(ROUTES.ACCOUNT);
                        setShowAccount(!showAccount);
                    }}
                >
                    {localization.accountSettings}
                </button>
                <button
                    class="w-full text-center bg-red-100 h-10 p-2 rounded-md hover:cursor-pointer hover:bg-red-200"
                    onClick={() => {
                        supabase.auth.signOut();
                        setShowAccount(!showAccount);
                    }}
                >
                    {localization.signOut}
                </button>
            </div>
        </Fragment>
    );
};

export default Navigation;
