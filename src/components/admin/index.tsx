import React from "react";
import { withAuthorization } from "../../context/session";
import "../../styles/component/component.scss";

const Admin: React.FC = (_) => <div className="component">Not implemented</div>;

export default withAuthorization(
    (authUser: firebase.User | null) => !!authUser
)(Admin);
