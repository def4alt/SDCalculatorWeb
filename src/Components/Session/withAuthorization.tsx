import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Firebase, { withFirebase } from "../Firebase";
import * as ROUTES from "../../Constants/routes";
import AuthUserContext from "./context";

interface withAuthorizationProps extends RouteComponentProps {
	firebase: Firebase;
}

type withAuthorizationState = {
	authUser?: firebase.User;
}

const withAuthorization = (
	condition: (authUser?: firebase.User) => boolean
) => <P extends object>(Component: React.ComponentType<P>) => {
	class WithAuthorization extends React.Component<P & withAuthorizationProps, withAuthorizationState> {
		listener?: EventListener;

		constructor(props: P & withAuthorizationProps) {
			super(props);

			this.state = {
				authUser: undefined
			};
		}

		componentDidMount() {
			this.listener = this.props.firebase.auth.onAuthStateChanged(
				(authUser: firebase.User | null) =>
					authUser &&
					!condition(authUser) &&
					this.props.history &&
					this.props.history.push(ROUTES.SIGN_IN)
			);
		}

		componentWillUnmount() {
			this.listener = undefined;
		}
		render() {
			return (
				<AuthUserContext.Consumer>
					{(authUser?: firebase.User) =>
						condition(authUser) && <Component {...this.props} />
					}
				</AuthUserContext.Consumer>
			);
		}
	}

	return withRouter(withFirebase(WithAuthorization));
};


export default withAuthorization;