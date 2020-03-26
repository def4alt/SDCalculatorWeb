import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "./routes";
import Landing from "./components/landing";
import Home from "./components/home";
import SignUp from "./components/sign_up";
import SignIn from "./components/sing_in";
import Account from "./components/account";
import Admin from "./components/admin";
import PasswordForget from "./components/password_forget";

interface AppProps {}

const App: React.FC<AppProps> = props => (
  <Router>
    <div className="root">
      <Route exact path={ROUTES.LANDING} component={Landing}/>
      <Route path={ROUTES.HOME} component={Home}/>
      <Route path={ROUTES.BUGS} component={Landing}/>
      <Route path={ROUTES.SIGN_UP} component={SignUp}/>
      <Route path={ROUTES.SIGN_IN} component={SignIn}/>
      <Route path={ROUTES.ACCOUNT} component={Account}/>
      <Route path={ROUTES.ADMIN} component={Admin}/>
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget}/>
    </div>
  </Router>
);

export default App;
