import React from "react";
import { stringsType, useLocalization } from "../Localization";
import { AuthUserContext, withAuthorization } from "../Session";
import PasswordChangeForm from "../PasswordChange";

import "./index.scss";

type AccountPageProps = {
	strings: stringsType;
};

const AccountPage: React.SFC<AccountPageProps> = props => (
	<AuthUserContext.Consumer>
		{authUser => (
			<div className="accountBox">
				<h1>
					{props.strings.account}: <p className="email">{authUser && authUser.email}</p> 
				</h1>
				<PasswordChangeForm />
			</div>
		)}
	</AuthUserContext.Consumer>
);

const condition = (authUser: firebase.User | undefined) => !!authUser;

export default withAuthorization(condition)(useLocalization(AccountPage));
