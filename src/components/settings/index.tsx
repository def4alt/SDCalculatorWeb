import React from "react";
import "../../styles/component/component.scss";
import "../../styles/button/button.scss";

// TODO: Language selection
// TODO: Calculation type selection
const Settings: React.FC = (_) => (
    <div className="component component_centered">
        <div className="component__element component__element_centered">
            Language:
            <button className="button_link">en</button>
            <button className="button_link">ru</button>
            <button className="button_link">uk</button>
        </div>
    </div>
);

export default Settings;
