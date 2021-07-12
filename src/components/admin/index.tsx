import React from "react";
import { withAuthorization } from "../../context/session";
import firebase from "firebase";

const Admin: React.FC = (_) => <div>Not implemented</div>;

export default withAuthorization(
    (authUser: firebase.User | null) => !!authUser
)(Admin);
