import React from "react";

import AuthUserContext from "./context";

import Firebase, { withFirebase } from "../Firebase";

type withAuthenticationProps = {
	firebase: Firebase;
};

type withAuthenticationState = {
	authUser: firebase.User | null;
};

const withAuthentication = <P extends object>(
	Component: React.ComponentType<P>
) => {
	class WithAuthentication extends React.Component<
		P & withAuthenticationProps,
		withAuthenticationState
	> {
		listener?: EventListener;

		constructor(props: P & withAuthenticationProps) {
			super(props);

			this.state = {
				authUser: null
			};
		}

		componentDidMount() {
			this.listener = this.props.firebase.auth.onAuthStateChanged(
				(authUser: firebase.User | null) =>
					authUser
						? this.setState({ authUser })
						: this.setState({ authUser: null })
			);
		}

		componentWillUnmount() {
			this.listener = undefined;
		}

		render() {
			return (
				<AuthUserContext.Provider value={this.state.authUser}>
					<Component {...(this.props as P)} />
				</AuthUserContext.Provider>
			);
		}
	}

	return withFirebase(WithAuthentication);
};

export default withAuthentication;
