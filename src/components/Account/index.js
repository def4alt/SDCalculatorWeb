import React from "react";
import PasswordChangeForm from "../PasswordChange";
import { withAuthorization, AuthUserContext } from "../Session";
import { useTheme } from "../Theme";
import RolesContext from "../Session/rolesContext";

const AccountPage = props => (
	<AuthUserContext.Consumer>
		{authUser => (
			<RolesContext>
				{role => (
					<div
						style={{
							paddingLeft: 10,
							color: props.theme.theme.color
						}}
					>
						<h1>Account: {authUser.email} {role}</h1>
						<PasswordChangeForm />
					</div>
				)}
			</RolesContext>
		)}
	</AuthUserContext.Consumer>
);

const condition = (authUser) => !!authUser;

export default useTheme(withAuthorization(condition)(AccountPage));
