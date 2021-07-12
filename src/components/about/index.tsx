import React, { useContext } from "react";
import { LocalizationContext } from "../../context/localization";

const About: React.FC = (_) => {
    const localization = useContext(LocalizationContext).localization;

    return (
        <div>
            <p>{localization.madeFor} ChemoView™</p>
        </div>
    );
};

export default About;
