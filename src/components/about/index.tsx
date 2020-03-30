import React from "react";
import { useLocalization, localizationType } from "../../context/localization";

interface AboutProps {
  localization: localizationType
}

const About: React.FC<AboutProps> = _ => (
  <div className="about">
    <p className="brand">SDCalculatorWeb</p>
    <p className="description">ChemoView™</p>
  </div>
);

export default useLocalization(About);
