import React from "react";
import { withAuthorization } from "Context/session";
import { User } from "firebase/auth";

const Admin: React.FC = (_) => <div>Not implemented</div>;

export default withAuthorization(
    (authUser: User | null) => !!authUser
)(Admin);
