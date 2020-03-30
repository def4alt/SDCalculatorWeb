import React from "react";
import { withAuthorization } from "../../context/session";
import "./admin.scss";

interface AdminProps {}

const Admin: React.FC<AdminProps> = props => <div className="admin">Not implemented</div>;

export default withAuthorization(
    (authUser: firebase.User | null) => !!authUser
)(Admin);
