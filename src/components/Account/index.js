import React from "react";
import PasswordChangeForm from "../PasswordChange";
import { withAuthorization, AuthUserContext } from "../Session";
import { useTheme } from "../Theme";

const AccountPage = (props) => (
	<AuthUserContext.Consumer>
		{authUser => (
			<div
				style={{ paddingLeft: 10, color: props.theme.theme.color  }}
			>
				<h1>Account: {authUser.email}</h1>
				<PasswordChangeForm />
			</div>
		)}
	</AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default useTheme(withAuthorization(condition)(AccountPage));
