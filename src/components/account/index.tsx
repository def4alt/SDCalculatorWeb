import React, { useContext, useEffect, useState } from "react";
import { LocalizationContext } from "Context/localization";

import "Styles/avatar/avatar.scss";
import "Styles/button/button.scss";
import "Styles/account/account.scss";
import { useNavigate } from "react-router";
import * as ROUTES from "../../routes";
import { UserContext } from "src/app";
import { supabase } from "Context/supabase/api";

// TODO: Add password change
// TODO: Add email change
// TODO: Add username change
const Account: React.FC = (_) => {
    const navigate = useNavigate();
    const { localization } = useContext(LocalizationContext);

    const [avatar, setAvatar] = useState<string>("");

    const user = useContext(UserContext);

    useEffect(() => {
        if (user === null) {
            navigate(ROUTES.SIGN_IN);
        }

        if (user !== null && user.user_metadata.photo_url !== undefined) {
            setAvatar(user.user_metadata.photo_url as string);
        }
    }, [user]);

    const onAvatarChange = (e: React.FormEvent<HTMLInputElement>) => {
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
