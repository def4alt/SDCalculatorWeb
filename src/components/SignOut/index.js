import React from "react";
import { withFirebase } from "../Firebase";
import Button from "react-bootstrap/Button";

import { useLocalization } from "../Localization";

const SignOutButton = props => (
	<Button onClick={props.firebase.doSignOut}>{props.strings.signOut}</Button>
);

export default useLocalization(withFirebase(SignOutButton));
