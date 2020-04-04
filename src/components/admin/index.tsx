import React from "react";
import { withAuthorization } from "../../context/session";
import "../../styles/component/component.scss";

interface AdminProps {}

const Admin: React.FC<AdminProps> = props => <div className="component">Not implemented</div>;

export default withAuthorization(
    (authUser: firebase.User | null) => !!authUser
)(Admin);
