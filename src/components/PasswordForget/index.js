import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import "./index.scss";

import { useLocalization } from "../Localization";

const PasswordForgetPage = props => (
	<div className="forgetPasswordBox">
		<h1>{props.strings.passwordForget}</h1>
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

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
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
			<form onSubmit={this.onSubmit}>
				<div className="email">
					<p>{this.props.strings.email}</p>
					<input
						name="email"
						value={this.state.email}
						onChange={this.onChange}
						type="text"
						placeholder={this.props.strings.email}
					/>
				</div>
				<button className="submitForget" disabled={isInvalid} type="submit">
					{this.props.strings.resetPassword}
				</button>
				<p className="text-danger">{error && <p>{error.message}</p>}</p>
			</form>
		);
	}
}

const PasswordForgetLink = () => (
	<a href={ROUTES.PASSWORD_FORGET}>Forgot Password?</a>
);

export default useLocalization(PasswordForgetPage);

const PasswordForgetForm = useLocalization(
	withFirebase(PasswordForgetFormBase)
);

export { PasswordForgetForm, PasswordForgetLink };
