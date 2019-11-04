import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useLocalization } from "../Localization";

const PasswordForgetPage = () => (
	<div>
		<h1>{this.props.strings.passwordForget}</h1>
		<PasswordForgetForm />
	</div>
);

const INITIAL_STATE = {
	email: "",
	error: null
};

class PasswordForgetFormBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	onSubmit(event) {
		const { email } = this.state;
		this.props.firebase
			.doPasswordReset(email)
			.then(() => {
				this.setState({ ...INITIAL_STATE });
			})
			.catch(error => {
				this.setState({ error });
			});
		event.preventDefault();
	}

	onChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	render() {
		const { email, error } = this.state;
		const isInvalid = email === "";

		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Group>
					<Form.Label>{this.props.strings.email}</Form.Label>
					<Form.Control
						name="email"
						value={this.state.email}
						onChange={this.onChange}
						type="text"
						placeholder={this.props.strings.email}
					/>
				</Form.Group>
				<Button disabled={isInvalid} type="submit">
					{this.props.strings.resetPassword}
				</Button>
				<Form.Text className="text-danger">
					{error && <p>{error.message}</p>}
				</Form.Text>
			</Form>
		);
	}
}

const PasswordForgetLink = () => (
	<p>
		<Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
	</p>
);

export default useLocalization(PasswordForgetPage);

const PasswordForgetForm = useLocalization(withFirebase(PasswordForgetFormBase));

export { PasswordForgetForm, PasswordForgetLink };
