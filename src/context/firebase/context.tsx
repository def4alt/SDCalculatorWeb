import React from "react";
import Firebase from "./firebase";

const FirebaseContext = React.createContext<Firebase | undefined>(undefined);

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export default FirebaseContext;
