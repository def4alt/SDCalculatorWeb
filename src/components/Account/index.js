import React from "react";
import PasswordChangeForm from "../PasswordChange";
import { withAuthorization, AuthUserContext } from "../Session";
import RolesContext from "../Session/rolesContext";
import { compose } from "recompose";
import { useLocalization } from "../Localization";

import "./index.scss";

const AccountPage = props => (
	<AuthUserContext.Consumer>
		{authUser => (
			<RolesContext>
				{role => (
					<div className="accountBox">
						<h1>
							{props.strings.account}: {authUser.email} {role}
						</h1>
						<PasswordChangeForm />
					</div>
				)}
			</RolesContext>
		)}
	</AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default compose(
	withAuthorization(condition),
	useLocalization
)(AccountPage);
