import React from "react";
import Firebase, { withFirebase } from "../Firebase";

import { useLocalization, stringsType } from "../Localization";

type signOutProps = {
    firebase: Firebase,
    strings: stringsType
}

const SignOutButton: React.SFC<signOutProps> = props => (
	<button onClick={props.firebase.doSignOut}>{props.strings.signOut}</button>
);

export default useLocalization(withFirebase(SignOutButton));