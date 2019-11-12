import React from "react";
import Firebase from "./firebase";

const FirebaseContext = React.createContext<Firebase>(new Firebase());

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type withFirebaseProps = {
	firebase: Firebase;
};

export const withFirebase = <P extends object>(
	Component: React.ComponentType<P>
): React.FC<Omit<P, keyof withFirebaseProps>> => props => (
	<FirebaseContext.Consumer>
		{(firebase: Firebase) => (
			<Component {...(props as P)} firebase={firebase} />
		)}
	</FirebaseContext.Consumer>
);

export default FirebaseContext;
