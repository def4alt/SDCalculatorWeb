import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import { PasswordForgetLink } from "../PasswordForget";
import "./index.scss";

import { useLocalization } from "../Localization";

const SignInPage = props => (
	<div className="signInBox">
		<h1>{props.strings.signIn}</h1>
		<SignInForm />
		<PasswordForgetLink />
		<SignUpLink />
	</div>
);
const INITIAL_STATE = {
	email: "",
	password: "",
	error: null
};
class SignInFormBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	componentDidMount() {
		this.listener = this.props.firebase.auth.onAuthStateChanged(authUser =>
			authUser
				? this.props.history.push(ROUTES.HOME)
				: this.props.history.push(ROUTES.SIGN_IN)
		);
	}

	componentWillUnmount() {
		this.listener();
	}

	onSubmit = event => {
		const { email, password } = this.state;

		this.props.firebase
			.doSignInWithEmailAndPassword(email, password)
			.then(() => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				this.setState({ error });
			});
		event.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, password, error } = this.state;
		const isInvalid = password === "" || email === "";
		return (
			<form onSubmit={this.onSubmit} className="form">
				<div className="email">
					<p>{this.props.strings.email}</p>
					<input
						name="email"
						onChange={this.onChange}
						type="email"
						placeholder={this.props.strings.email}
					/>
				</div>

				<div className="password">
					<p>{this.props.strings.password}</p>
					<input
						name="password"
						onChange={this.onChange}
						type="password"
						placeholder={this.props.strings.passHint}
					/>
				</div>
				<button disabled={isInvalid} className="submit" type="submit">
					{this.props.strings.signIn}
				</button>
				<button
					className="guestButton"
					type="submit"
					onClick={() => this.props.history.push(ROUTES.HOME)}
				>
					{this.props.strings.guestMode}
				</button>

				<p className="text-danger">{error && error.message}</p>
			</form>
		);
	}
}
const SignInForm = compose(
	withRouter,
	withFirebase,
	useLocalization
)(SignInFormBase);

export default useLocalization(SignInPage);
export { SignInForm };
