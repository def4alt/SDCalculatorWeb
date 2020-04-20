import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Firebase, { FirebaseContext } from "./context/firebase";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.scss";

ReactDOM.render(
    <React.StrictMode>
        <FirebaseContext.Provider value={new Firebase()}>
            <CookiesProvider>
                <Router>
                    <App />
                </Router>
            </CookiesProvider>
        </FirebaseContext.Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

serviceWorker.register();
