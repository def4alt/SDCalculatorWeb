import React, { useContext } from "react";
import { LocalizationContext } from "../../context/localization";

import "../../styles/component/component.scss";

const About: React.FC = (_) => {
    const localization = useContext(LocalizationContext).localization;

    return (
        <div className="component component_centered">
            <p>{localization.madeFor} ChemoView™</p>
        </div>
    );
};

export default About;
