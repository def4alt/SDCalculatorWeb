import React from "react";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router-dom";
import App from "./app";

import "./index.scss";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <CookiesProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </CookiesProvider>
    </React.StrictMode>
);
