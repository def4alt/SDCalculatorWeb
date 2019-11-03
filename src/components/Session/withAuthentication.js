import React from "react";

import AuthUserContext from "./context";
import RolesContext from "./rolesContext";
import { withFirebase } from "../Firebase";

import * as ROLES from "../../constants/roles";

const withAuthentication = Component => {
	class WithAuthentication extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				authUser: null,
				role: ROLES.GUEST
			};
		}

		componentDidMount() {
			this.listener = this.props.firebase.auth.onAuthStateChanged(
				authUser => {
					authUser
						? this.setState({
								authUser,
								role:
									authUser.uid ===
									"Ih0XNDRPuJSSELqXIxnMaI05C2V2"
										? ROLES.ADMIN
										: ROLES.USER
						})
						: this.setState({ authUser: null });
				}
			);
		}
		componentWillUnmount() {
			this.listener();
		}

		render() {
			return (
				<AuthUserContext.Provider value={this.state.authUser}>
					<RolesContext.Provider value={this.state.role}>
						<Component {...this.props} />
					</RolesContext.Provider>
				</AuthUserContext.Provider>
			);
		}
	}

	return withFirebase(WithAuthentication);
};

export default withAuthentication;
