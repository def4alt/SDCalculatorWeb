import React from "react";
import Firebase from "./firebase";
import { FirebaseContext } from ".";

const withFirebase = <P extends object>(Component: React.ComponentType<P>) => {
    const WithFirebase: React.FC<P> = (props) => {
        return (
            <FirebaseContext.Provider value={new Firebase()}>
                <Component {...(props as P)} />
            </FirebaseContext.Provider>
        );
    };

    return WithFirebase;
};

export default withFirebase;
