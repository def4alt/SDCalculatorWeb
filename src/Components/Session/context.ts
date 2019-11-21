import React from "react";
import "firebase/auth";

const AuthUserContext = React.createContext<firebase.User | null>(
	null
);

export default AuthUserContext;
