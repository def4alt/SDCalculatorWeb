import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Firebase, { withFirebase } from "../firebase";
import * as ROUTES from "../../routes";
import AuthUserContext from "./context";

interface withAuthorizationProps extends RouteComponentProps {
  firebase: Firebase;
}

type withAuthorizationState = {
  authUser: firebase.User | null;
};

const withAuthorization = (
  condition: (authUser: firebase.User | null) => boolean
) => <P extends object>(Component: React.ComponentType<P>) => {
  class WithAuthorization extends React.Component<
    P & withAuthorizationProps,
    withAuthorizationState
  > {
    listener?: EventListener;

    constructor(props: P & withAuthorizationProps) {
      super(props);

      this.state = {
        authUser: null
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        (authUser: firebase.User | null) =>
          !condition(authUser) && this.props.history.push(ROUTES.SIGN_IN)
      );
    }

    componentWillUnmount() {
      this.listener = undefined;
    }
    render() {
      return (
        <AuthUserContext.Consumer>
          {(authUser: firebase.User | null) =>
            condition(authUser) ? <Component {...(this.props as P)} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withRouter(withFirebase(WithAuthorization));
};

export default withAuthorization;
