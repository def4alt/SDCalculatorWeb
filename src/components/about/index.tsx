import React from "react";
import { useLocalization, localizationType } from "../../context/localization";

import "./about.scss";

interface AboutProps {
  localization: localizationType
}

const About: React.FC<AboutProps> = _ => (
  <div className="about">
    <p className="description">Made for ChemoView™</p>
  </div>
);

export default useLocalization(About);
