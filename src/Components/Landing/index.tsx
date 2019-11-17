import React from "react";
import "./index.scss";

import { useLocalization, stringsType } from "../Localization";

type LandingPageProps = {
  strings: stringsType
}

class LandingPage extends React.Component<LandingPageProps> {
  render() {
    return (
      <div className="brandBox">
        <p className="brand">SDCalculatorWeb</p>
        <p className="description">{this.props.strings.madeFor} ChemoView™</p>
      </div>
    );
  }
}

export default useLocalization(LandingPage);
