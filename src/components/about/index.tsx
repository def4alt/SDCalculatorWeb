import React from "react";
import { useLocalization, localizationType } from "../../context/localization";
import "../../styles/component/component.scss";

interface AboutProps {
  localization: localizationType
}

const About: React.FC<AboutProps> = _ => (
  <div className="component component_centered">
    <p>Made for ChemoView™</p>
  </div>
);

export default useLocalization(About);
