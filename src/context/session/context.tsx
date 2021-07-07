import React from "react";
import "firebase/auth";
import firebase from "firebase";

const AuthUserContext = React.createContext<firebase.User | null>(null);

export default AuthUserContext;
