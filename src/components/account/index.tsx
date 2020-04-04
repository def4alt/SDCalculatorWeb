import React from "react";
import { withAuthorization } from "../../context/session";
import "../../styles/component/component.scss";

interface AccountProps {}

const Account: React.FC<AccountProps> = props => (
    <div className="component">Not implemented</div>
);

export default withAuthorization(
    (authUser: firebase.User | null) => !!authUser
)(Account);
