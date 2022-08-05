import { h } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";
import { LocalizationContext } from "src/context/localization";

import "src/styles/avatar/avatar.scss";
import "src/styles/button/button.scss";
import "src/styles/account/account.scss";
import * as ROUTES from "src/routes";
import { UserContext } from "src/app";
import { supabase } from "src/context/supabase/api";
import { route } from "preact-router";
import { TargetedEvent } from "preact/compat";

// TODO: Add password change
// TODO: Add email change
// TODO: Add username change
const Account: React.FC = (_) => {
    const { localization } = useContext(LocalizationContext);

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
        <div className="account">
            <img
                className="account__avatar avatar avatar_squared"
                src={avatar}
                alt="avatar"
            />
            <label className="account__image-select file-browser">
                <input
                    type="file"
                    aria-label="File browser"
                    onChange={onAvatarChange}
                />
                <span className="file-browser__text_minimal">
                    {localization.uploadImage}
                </span>
            </label>
        </div>
    );
};

export default Account;
