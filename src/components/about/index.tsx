import React, { useContext } from "react";
import { LocalizationContext } from "Context/localization";
import "Styles/about/about.scss";

const About: React.FC = (_) => {
    const localization = useContext(LocalizationContext).localization;

    return (
        <div className="about">
            <p>{localization.madeFor} ChemoView™</p>
        </div>
    );
};

export default About;
