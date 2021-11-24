import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Firebase, { FirebaseContext } from "../firebase";
import * as ROUTES from "../../routes";
import AuthUserContext from "./context";
import { User } from "firebase/auth";

const withAuthorization =
    (condition: (authUser: User | null) => boolean) =>
    <P extends object>(Component: React.ComponentType<P>) => {
        const WithAuthorization: React.FC<P> = (
            props
        ) => {
            const firebase = useContext(FirebaseContext) as Firebase;
            const navigate = useNavigate();
            
            useEffect(() => {
                const unsubscribe = firebase.auth.onAuthStateChanged(
                    (authUser) =>
                        !condition(authUser) &&
                        navigate(ROUTES.SIGN_IN)
                );

                return () => unsubscribe();
            });

            return (
                <AuthUserContext.Consumer>
                    {(authUser) =>
                        condition(authUser) ? (
                            <Component {...(props as P)} />
                        ) : null
                    }
                </AuthUserContext.Consumer>
            );
        };

        return WithAuthorization;
    };

export default withAuthorization;
