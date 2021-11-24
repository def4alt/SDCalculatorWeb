import React from "react";
import {User} from "firebase/auth";

const AuthUserContext = React.createContext<User | null>(null);

export default AuthUserContext;
