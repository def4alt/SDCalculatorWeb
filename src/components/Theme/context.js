import React from "react";
import { WiDaySunny, WiNightClear } from "react-icons/wi";

const themes = {
    light: {
        name: "light",
        backgroundColor: "#ffffff",
        lightBack: "lightgrey",
        color: "#343a40",
        variant: "dark",
        variantOutline: "outline-dark",
        navBarVariant: "light",
        icon: <WiDaySunny/>,
        navBarIcon: <WiNightClear/>
    },
    dark: {
        name: "dark",
        backgroundColor: "#272727",
        lightBack: "#7b7b7b",
        color: "#ffffff",
        variant: "light",
        variantOutline: "outline-light",
        navBarVariant: "dark",
        icon: <WiNightClear/>,
        navBarIcon: <WiDaySunny/>
    }
}

const ThemeContext = React.createContext(themes.light);

export { ThemeContext, themes };