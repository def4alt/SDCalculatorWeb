import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import SignOutButton from "../SignOut";

import * as ROUTES from "../../constants/routes";

import { AuthUserContext } from "../Session";

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand href="#home">SDCalculatorWeb</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
        <Nav.Link href={ROUTES.ACCOUNT}>Account</Nav.Link>
      </Nav>
      <Nav className="mr-0">
        <SignOutButton />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand href="#home">SDCalculatorWeb</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href={ROUTES.SIGN_IN}>Sign In</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Navigation;
