import React from "react";
import { withAuthorization } from "../../context/session";
import "./account.scss";

interface AccountProps {}

const Account: React.FC<AccountProps> = props => (
    <div className="account">Not implemented</div>
);

export default withAuthorization(
    (authUser: firebase.User | null) => !!authUser
)(Account);
