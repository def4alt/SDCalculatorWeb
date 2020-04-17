import React, { useContext, useState } from "react";
import { withAuthorization, AuthUserContext } from "../../context/session";
import { User } from "firebase";

import "../../styles/component/component.scss";
import "../../styles/avatar/avatar.scss";
import "../../styles/button/button.scss";

// TODO: Add password change
// TODO: Add email change
const Account: React.FC = (_) => {
    const user = useContext(AuthUserContext) as User;

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
        <div className="component component_centered">
            <div className="component__element">
                <img
                    className="avatar avatar_big avatar_squared"
                    src={avatar}
                    alt="avatar"
                />
            </div>
            <div className="component__element component__element_centered">
                <label className="file-browser">
                    <input
                        type="file"
                        aria-label="File browser"
                        onChange={onAvatarChange}
                    />
                    <span className="file-browser__text file-browser__text_minimal">
                        Upload image
                    </span>
                </label>
            </div>
        </div>
    );
};

export default withAuthorization(
    (authUser: firebase.User | null) => !!authUser
)(Account);
