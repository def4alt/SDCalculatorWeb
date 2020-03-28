import React from "react";

import "./navigation.scss";
import { withRouter, RouterProps } from "react-router";
import * as ROUTES from "../../routes";

interface NavigationProps extends RouterProps {

}

const Navigation: React.FC<NavigationProps> = props => (
  <div>
    <div id="nav">
      <button id="settings">
        <p></p>
        <p></p>
        <p></p>
      </button>
      <button id="logo" onClick={() => props.history.push(ROUTES.HOME)}>
        SDCalculator
      </button>
    </div>
    <div className="topnav" id="myTopnav">
      <a>Home</a>
      <a>About</a>
    </div>
  </div>
);

export default withRouter(Navigation);
