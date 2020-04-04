import React from "react";
import { withRouter, RouterProps } from "react-router";
import * as ROUTES from "../../routes";
import Firebase, { withFirebase } from "../../context/firebase";
import { FaFacebookF, FaGoogle } from "react-icons/fa";

import "../../styles/form/form.scss";
import "../../styles/form/form__oauth/form__oauth.scss";

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
            error: "",
        };

        this.signInWithFacebook = this.signInWithFacebook.bind(this);
        this.signInWithGoogle = this.signInWithGoogle.bind(this);
    }

    signInWithGoogle = () => {
        this.props.firebase
            .doSignInWithGoogle()
            .then(() => this.props.history.push(ROUTES.HOME));
    };
    signInWithFacebook = () => {
        this.props.firebase
            .doSignInWithFacebook()
            .then(() => this.props.history.push(ROUTES.HOME));
    };

    onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.firebase
            .doSignInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.setState({ email: "", password: "", error: "" });
                this.props.history.push(ROUTES.HOME);
            })
            .catch((error) => {
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
            <div className="form">
                <button
                    onClick={this.signInWithFacebook}
                    className="form__oauth form__oauth_fb"
                >
                    <FaFacebookF className="icon" /> Login with Facebook
                </button>
                <button
                    onClick={this.signInWithGoogle}
                    className="form__oauth form__oauth_gl"
                >
                    <FaGoogle className="icon" /> Login with Google
                </button>
                <form onSubmit={this.onSubmit}>
                    <div className="form__input">
                        <p>Email</p>
                        <input
                            name="email"
                            onChange={this.onEmailChange}
                            type="email"
                            placeholder="example@example.com"
                        />
                    </div>

                    <div className="form__input">
                        <p>Password</p>
                        <input
                            name="password"
                            onChange={this.onPasswordChange}
                            type="password"
                            placeholder="15%$vd09"
                        />
                    </div>

                    <button
                        className="form__link"
                        onClick={() =>
                            this.props.history.push(ROUTES.PASSWORD_FORGET)
                        }
                    >
                        Forgot password?
                    </button>
                    <button
                        className="form__link"
                        onClick={() => this.props.history.push(ROUTES.SIGN_UP)}
                    >
                        Sign Up
                    </button>

                    <button
                        disabled={isInvalid}
                        className="form__submit"
                        type="submit"
                    >
                        Sign In
                    </button>

                    <p className="form__error">{this.state.error}</p>
                </form>
            </div>
        );
    }
}

export default withRouter(withFirebase(SignIn));
