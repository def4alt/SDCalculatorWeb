import React from "react";
import { withFirebase } from "../Firebase";

import { useLocalization } from "../Localization";

const SignOutButton = props => (
	<button onClick={props.firebase.doSignOut}>{props.strings.signOut}</button>
);

export default useLocalization(withFirebase(SignOutButton));
