import { h } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";
import * as ROUTES from "src/routes";
import { UserContext } from "src/app";
import { supabase } from "src/context/supabase/api";
import { route } from "preact-router";
import { TargetedEvent } from "preact/compat";
import { FaRegUser } from "react-icons/fa";

// TODO: Add password change
// TODO: Add email change
// TODO: Add username change
const Account: React.FC = (_) => {
    const [avatar, setAvatar] = useState<string>("");

    const user = useContext(UserContext);

    useEffect(() => {
        if (user === null) {
            route(ROUTES.SIGN_IN);
        }

        if (user !== null && user.user_metadata.photo_url !== undefined) {
            setAvatar(user.user_metadata.photo_url as string);
        }
    }, [user]);

    const onAvatarChange = (e: TargetedEvent<HTMLInputElement>) => {
        if (!e.currentTarget.files) return;
        const file = e.currentTarget.files[0];
        if (!file) return;
        const types = /(\.jpg|\.jpeg|\.bmp|\.png)$/i;
        if (!file.name.match(types)) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setAvatar(reader.result as string);

            if (user)
                supabase.auth.update({
                    data: { photo_url: reader.result as string },
                });
        };
    };

    return (
        <div class="h-screen flex flex-col justify-center items-center gap-4">
            {avatar ? (
                <img class="w-20 h-20" src={avatar} alt="avatar" />
            ) : (
                <div class="text-6xl">
                    <FaRegUser />
                </div>
            )}
            <div class="w-1/2 h-14 flex justify-center align-middle items-center border-2 rounded-md px-2 py-4 border-gray-200">
                <label class="block w-full">
                    <span class="sr-only">Choose File</span>
                    <input
                        type="file"
                        class={`block w-full font-bold text-sm text-gray-500 file:hover:cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-gray-100 file:rounded-md file:border-2 file:border-solid file:shadow-none file:text-sm file:font-semibold file:bg-gray-200 hover:file:bg-gray-300 hover:file:border-gray-200`}
                        onChange={onAvatarChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default Account;
