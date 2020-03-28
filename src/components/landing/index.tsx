import React from "react";
import { RouterProps, withRouter } from "react-router";
import * as ROUTES from "../../routes";
import { useLocalization, localizationType } from "../../context/localization";

interface LandingProps extends RouterProps {
  localization: localizationType
}

const Landing: React.FC<LandingProps> = props => (
  <div className="landing">
    <p className="brand">SDCalculatorWeb</p>
    <p className="description">ChemoView™</p>
    <button
      onClick={() => props.history.push(ROUTES.HOME)}
      className="startButton"
    >
      Start
    </button>
  </div>
);

export default withRouter(useLocalization(Landing));
