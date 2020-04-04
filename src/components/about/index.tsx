import React from "react";
import { useLocalization, localizationType } from "../../context/localization";
import "../../styles/component/component.scss";

interface AboutProps {
  localization: localizationType
}

const About: React.FC<AboutProps> = _ => (
  <div className="component component_centered">
    <div className="component__element_centered">Made for ChemoView™</div>
  </div>
);

export default useLocalization(About);
