import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useTheme } from "../Theme";
import { useLocalization, LocalizationContext } from "../Localization";

const SignUpPage = props => (
	<div
		style={{
			color: props.theme.theme.color,
			paddingLeft: 10,
			marginRight: "60vw"
		}}
	>
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
			<Form onSubmit={this.onSubmit}>
				<Form.Group>
					<Form.Label>{this.props.strings.username}</Form.Label>

					<Form.Control
						name="username"
						value={username}
						onChange={this.onChange}
						type="text"
						placeholder={this.props.strings.usernameHint}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>{this.props.strings.email}</Form.Label>

					<Form.Control
						name="email"
						value={email}
						onChange={this.onChange}
						type="text"
						placeholder="email@example.com"
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>{this.props.strings.password}</Form.Label>
					<Form.Control
						name="passwordOne"
						value={passwordOne}
						onChange={this.onChange}
						type="password"
						placeholder="E.g. pasdgf@#!1254"
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>{this.props.strings.repeatPassword}</Form.Label>
					<Form.Control
						name="passwordTwo"
						value={passwordTwo}
						onChange={this.onChange}
						type="password"
					/>
				</Form.Group>
				<Button disabled={isInvalid} type="submit">
					{this.props.strings.signUp}
				</Button>
				<Form.Text className="text-danger">
					{error && <p>{error.message}</p>}
				</Form.Text>
			</Form>
		);
	}
}

const SignUpLink = () => (
	<LocalizationContext.Consumer>
		{({ strings }) => (
			<p>
				{strings.dontHave}{" "}
				<Link to={ROUTES.SIGN_UP}>{strings.signUp}</Link>
			</p>
		)}
	</LocalizationContext.Consumer>
);

const SignUpForm = compose(
	withRouter,
	withFirebase,
	useLocalization
)(SignUpFormBase);

export default useLocalization(useTheme(SignUpPage));
export { SignUpForm, SignUpLink };
