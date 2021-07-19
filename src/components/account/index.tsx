import React, { useContext, useState } from "react";
import { withAuthorization, AuthUserContext } from "Context/session";
import firebase from "firebase";
import { LocalizationContext } from "Context/localization";

import "Styles/avatar/avatar.scss";
import "Styles/button/button.scss";

// TODO: Add password change
// TODO: Add email change
// TODO: Add username change
const Account: React.FC = (_) => {
    const user = useContext(AuthUserContext) as firebase.User;
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

            user.updateProfile({
                photoURL: reader.result as string,
            });
        };
    };

    return (
        <div>
            <div>
                <img
                    className="avatar avatar_squared"
                    src={avatar}
                    alt="avatar"
                />
            </div>
            <div>
                <label className="file-browser">
                    <input
                        type="file"
                        aria-label="File browser"
                        onChange={onAvatarChange}
                    />
                    <span className="file-browser__text file-browser__text_minimal">
                        {localization.uploadImage}
                    </span>
                </label>
            </div>
        </div>
    );
};

export default withAuthorization(
    (authUser: firebase.User | null) => !!authUser
)(Account);
