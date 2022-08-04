import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "src/app";
import * as ROUTES from "../../routes";

const Admin: React.FC = (_) => {
    const user = useContext(UserContext);

    const navigate = useNavigate();
    if (user === null) navigate(ROUTES.HOME);

    return <div>Not implemented</div>;
};
export default Admin;
