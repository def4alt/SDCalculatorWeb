import { h } from "preact";
import { useContext } from "preact/hooks";
import { route } from "preact-router";
import { UserContext } from "src/app";
import * as ROUTES from "src/routes";

const Admin: React.FC = (_) => {
    const user = useContext(UserContext);

    if (user === null) route(ROUTES.HOME);

    return <div>Not implemented</div>;
};
export default Admin;
