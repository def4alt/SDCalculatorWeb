import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import App from "./Components/App";
import Firebase, { FirebaseContext } from "./Components/Firebase";

import "./index.scss";

ReactDOM.render(
	<FirebaseContext.Provider value={new Firebase()}>
		<App />
	</FirebaseContext.Provider>,
	document.getElementById("root")
);

serviceWorker.register();
