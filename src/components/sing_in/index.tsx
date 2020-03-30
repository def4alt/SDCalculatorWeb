import React from "react";
import { withRouter, RouterProps } from "react-router";
import * as ROUTES from "../../routes";
import Firebase, { withFirebase } from "../../context/firebase";

import "./sign_in.scss";

interface SignInProps extends RouterProps {
    firebase: Firebase;
}
interface SignInState {
    email: string;
    password: string;
    error: string;
}

class SignIn extends React.Component<SignInProps, SignInState> {
    constructor(props: SignInProps) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: ""
        };
    }

    onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        this.props.firebase
            .doSignInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.setState({ email: "", password: "", error: "" });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error: error.message });
            });
    };
    onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ password: event.currentTarget.value });
    };
    onEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ email: event.currentTarget.value });
    };

    render() {
        let isInvalid: boolean =
            this.state.email === "" && this.state.password === "";

        return (
            <form onSubmit={this.onSubmit} className="signin">
                <div className="form">
                    <p>Email</p>
                    <input
                        name="email"
                        onChange={this.onEmailChange}
                        type="email"
                        placeholder="example@example.com"
                    />
                </div>

                <div className="form">
                    <p>Password</p>
                    <input
                        name="password"
                        onChange={this.onPasswordChange}
                        type="password"
                        placeholder="15%$vd09"
                    />
                </div>

                <div className="pwd-forget-link">
                    <a href={ROUTES.PASSWORD_FORGET}>Forgot password?</a>
                </div>
                
                <button disabled={isInvalid} className="submit" type="submit">
                    Sign In
                </button>

                <p className="text-danger">{this.state.error}</p>
            </form>
        );
    }
}

export default withRouter(withFirebase(SignIn));
