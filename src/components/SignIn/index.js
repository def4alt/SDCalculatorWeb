import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import { PasswordForgetLink } from "../PasswordForget";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useTheme } from "../Theme";
import { useLocalization } from "../Localization";

const SignInPage = props => (
	<div
		style={{
			paddingLeft: 10,
			color: props.theme.theme.color,
			marginRight: "60vw"
		}}
	>
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
			<div>
				<Form onSubmit={this.onSubmit}>
					<Form.Group>
						<Form.Label>{this.props.strings.email}</Form.Label>
						<Form.Control
							name="email"
							onChange={this.onChange}
							type="email"
							placeholder={this.props.strings.email}
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>{this.props.strings.password}</Form.Label>
						<Form.Control
							name="password"
							onChange={this.onChange}
							type="password"
							placeholder={this.props.strings.passHint}
						/>
					</Form.Group>
					<Button disabled={isInvalid} type="submit">
						{this.props.strings.signIn}
					</Button>
					<Button
						style={{ marginLeft: 20 }}
						type="submit"
						onClick={() => this.props.history.push(ROUTES.HOME)}
						variant="outline-dark"
					>
						{this.props.strings.guestMode}
					</Button>

					<Form.Text className="text-danger">
						{error && <p>{error.message}</p>}
					</Form.Text>
				</Form>
			</div>
		);
	}
}
const SignInForm = compose(
	withRouter,
	withFirebase,
	useLocalization
)(SignInFormBase);

export default useLocalization(useTheme(SignInPage));
export { SignInForm };
