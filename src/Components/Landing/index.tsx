import React from "react";
import "./index.scss";
import { withRouter, RouterProps } from "react-router";
import * as ROUTES from "../../Constants/routes";

import { useLocalization, stringsType } from "../Localization";

interface LandingPageProps extends RouterProps {
  strings: stringsType;
}

class LandingPage extends React.Component<LandingPageProps> {
  render() {
    return (
      <div className="brandBox">
        <p className="brand">SDCalculatorWeb</p>
        <p className="description">{this.props.strings.madeFor} ChemoView™</p>
        <button
          onClick={() => this.props.history.push(ROUTES.HOME)}
          className="startButton"
        >
          {this.props.strings.letsStart}
        </button>
      </div>
    );
  }
}

export default withRouter(useLocalization(LandingPage));
