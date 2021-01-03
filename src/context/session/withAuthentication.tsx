import React, { useContext, useEffect, useState } from "react";

import AuthUserContext from "./context";

import Firebase, { FirebaseContext } from "../firebase";
import firebase from "firebase";

const withAuthentication = <P extends object>(
    Component: React.ComponentType<P>
) => {
    const WithAuthentication: React.FC<P> = (props) => {
        const [user, setUser] = useState<firebase.User | null>(null);
        const firebase = useContext(FirebaseContext) as Firebase;

        if (!firebase) return (<></>);

        useEffect(() => {
            const unsubscribe = firebase.auth.onAuthStateChanged(setUser);

            return () => unsubscribe();
        }, [firebase.auth]);

        return (
            <AuthUserContext.Provider value={user}>
                <Component {...(props as P)} />
            </AuthUserContext.Provider>
        );
    };

    return WithAuthentication;
};

export default withAuthentication;
