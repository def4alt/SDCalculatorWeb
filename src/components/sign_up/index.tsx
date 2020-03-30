import React from "react";
import { withRouter, RouterProps } from "react-router";
import * as ROUTES from "../../routes";
import Firebase, { withFirebase } from "../../context/firebase";

import "./sign_up.scss";

interface SignUpProps extends RouterProps {
    firebase: Firebase;
}
interface SignUpState {
    email: string;
    password: string;
    passwordConfirm: string;
    error: string;
    username: string;
}

class SignUp extends React.Component<SignUpProps, SignUpState> {
    constructor(props: SignUpProps) {
        super(props);

        this.state = {
            email: "",
            password: "",
            passwordConfirm: "",
            error: "",
            username: ""
        };
    }

    onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { username, email, password } = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, password)
            .then(authUser => {
                return (
                    authUser.user &&
                    this.props.firebase
                        .user(authUser.user.uid)
                        .set({ username, email })
                );
            })
            .then(() => {
                this.setState({
                    email: "",
                    password: "",
                    passwordConfirm: "",
                    error: ""
                });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error: error.message });
            });
    };
    onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ password: event.currentTarget.value });
    };
    onPasswordConfirmChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ passwordConfirm: event.currentTarget.value });
    };
    onEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ email: event.currentTarget.value });
    };
    onUsernameChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({ username: event.currentTarget.value });
    };

    render() {
        let isInvalid: boolean =
            this.state.email === "" ||
            this.state.password === "" ||
            this.state.password !== this.state.passwordConfirm ||
            this.state.password === "";

        return (
            <form onSubmit={this.onSubmit} className="signup">
                <div className="form">
                    <p>Username</p>
                    <input
                        name="username"
                        onChange={this.onUsernameChange}
                        type="text"
                        placeholder="def4alt"
                    />
                </div>
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
                <div className="form">
                    <p>Password Confirm</p>
                    <input
                        name="passwordConfirm"
                        onChange={this.onPasswordConfirmChange}
                        type="password"
                    />
                </div>
                <button disabled={isInvalid} className="submit" type="submit">
                    Sign In
                </button>

                <p className="text-danger">{this.state.error}</p>
            </form>
        );
    }
}

export default withRouter(withFirebase(SignUp));
