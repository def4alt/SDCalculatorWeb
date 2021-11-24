import React, { useContext, useState } from "react";
import { withAuthorization, AuthUserContext } from "Context/session";
import { LocalizationContext } from "Context/localization";

import "Styles/avatar/avatar.scss";
import "Styles/button/button.scss";
import "Styles/account/account.scss";
import { updateProfile, User } from "firebase/auth";

// TODO: Add password change
// TODO: Add email change
// TODO: Add username change
const Account: React.FC = (_) => {
    const user = useContext(AuthUserContext) as User;
    const localization = useContext(LocalizationContext).localization;

    const [avatar, setAvatar] = useState<string>(user.photoURL as string);

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

            updateProfile(user, {
                photoURL: reader.result as string,
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

export default withAuthorization(
    (authUser: User | null) => !!authUser
)(Account);
