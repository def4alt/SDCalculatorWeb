import React, { useContext, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Firebase, { FirebaseContext } from "../firebase";
import * as ROUTES from "../../routes";
import AuthUserContext from "./context";

const withAuthorization = (
    condition: (authUser: firebase.User | null) => boolean
) => <P extends object>(Component: React.ComponentType<P>) => {
    const WithAuthorization: React.FC<P & RouteComponentProps> = (props) => {
        const firebase = useContext(FirebaseContext) as Firebase;

        useEffect(() => {
            const unsubscribe = firebase.auth.onAuthStateChanged(
                (authUser) =>
                    !condition(authUser) && props.history.push(ROUTES.SIGN_IN)
            );

            return () => unsubscribe();
        });

        return (
            <AuthUserContext.Consumer>
                {(authUser) =>
                    condition(authUser) ? <Component {...(props as P)} /> : null
                }
            </AuthUserContext.Consumer>
        );
    };

    return withRouter(WithAuthorization);
};

export default withAuthorization;
