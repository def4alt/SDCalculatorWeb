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

const SignInPage = props => (
	<div
		style={{
			paddingLeft: 10,
			color: props.theme.theme.color,
			marginRight: "60vw"
		}}
	>
		<h1>Sign In</h1>
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
			authUser ? this.props.history.push(ROUTES.HOME) : this.props.history.push(ROUTES.SIGN_IN)
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
			console.log("he")
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
						<Form.Label>Email address</Form.Label>
						<Form.Control
							name="email"
							onChange={this.onChange}
							type="email"
							placeholder="Enter email"
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control
							name="password"
							onChange={this.onChange}
							type="password"
							placeholder="Password"
						/>
					</Form.Group>
					<Button disabled={isInvalid} type="submit">
						Sign In
					</Button>
					<Button
						style={{ marginLeft: 20 }}
						type="submit"
						onClick={() => this.props.history.push(ROUTES.HOME)}
						variant="outline-dark"
					>
						Guest mode
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
	withFirebase
)(SignInFormBase);

export default useTheme(SignInPage);
export { SignInForm };
