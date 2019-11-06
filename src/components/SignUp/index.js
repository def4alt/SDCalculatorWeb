import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import "./index.scss";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { useLocalization, LocalizationContext } from "../Localization";

const SignUpPage = props => (
	<div className="signUpBox">
		<h1>{props.strings.signUp}</h1>
		<SignUpForm />
	</div>
);

const INITIAL_STATE = {
	username: "",
	email: "",
	passwordOne: "",
	passwordTwo: "",
	error: null
};

class SignUpFormBase extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}
	onSubmit = event => {
		const { username, email, passwordOne } = this.state;
		this.props.firebase
			.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
				// Create a user in your Firebase realtime database
				return this.props.firebase.user(authUser.user.uid).set({
					username,
					email
				});
			})
			.then(() => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.LANDING);
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
		const { username, email, passwordOne, passwordTwo, error } = this.state;
		const isInvalid =
			passwordOne !== passwordTwo ||
			passwordOne === "" ||
			email === "" ||
			username === "";
		return (
			<form onSubmit={this.onSubmit} className="signUpForm">
				<div className="username">
					<p>{this.props.strings.username}</p>

					<input
						name="username"
						value={username}
						onChange={this.onChange}
						type="text"
						placeholder={this.props.strings.usernameHint}
					/>
				</div>

				<div className="email">
					<p>{this.props.strings.email}</p>

					<input
						name="email"
						value={email}
						onChange={this.onChange}
						type="text"
						placeholder="email@example.com"
					/>
				</div>

				<div className="password">
					<p>{this.props.strings.password}</p>
					<input
						name="passwordOne"
						value={passwordOne}
						onChange={this.onChange}
						type="password"
						placeholder="pasdgf@#!1254"
					/>
				</div>
				<div className="password">
					<p>{this.props.strings.repeatPassword}</p>
					<input
						name="passwordTwo"
						value={passwordTwo}
						onChange={this.onChange}
						type="password"
					/>
				</div>
				<button disabled={isInvalid} className="submit" type="submit">
					{this.props.strings.signUp}
				</button>
				<p className="text-danger">{error && <p>{error.message}</p>}</p>
			</form>
		);
	}
}

const SignUpLink = () => (
	<LocalizationContext.Consumer>
		{({ strings }) => (
			<p>
				{strings.dontHave} <a href={ROUTES.SIGN_UP}>{strings.signUp}</a>
			</p>
		)}
	</LocalizationContext.Consumer>
);

const SignUpForm = compose(
	withRouter,
	withFirebase,
	useLocalization
)(SignUpFormBase);

export default useLocalization(SignUpPage);
export { SignUpForm, SignUpLink };
