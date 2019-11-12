import React from "react";
import "firebase/auth";

const AuthUserContext = React.createContext<firebase.User | undefined>(
	undefined
);

export default AuthUserContext;
