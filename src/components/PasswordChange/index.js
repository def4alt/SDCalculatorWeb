import React, { Component } from "react";
import { withFirebase } from "../Firebase";

import { compose } from "recompose";
import { useLocalization } from "../Localization";

import "./index.scss";

const INITIAL_STATE = {
	passwordOne: "",
	passwordTwo: "",
	error: null
};

class PasswordChangeForm extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		const { passwordOne } = this.state;
		this.props.firebase
			.doPasswordUpdate(passwordOne)
			.then(() => {
				this.setState({ ...INITIAL_STATE });
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
		const { passwordOne, passwordTwo, error } = this.state;
		const isInvalid = passwordOne !== passwordTwo || passwordOne === "";
		return (
			<form onSubmit={this.onSubmit}>
				<div className="password">
					<p>{this.props.strings.password}</p>
					<input
						name="passwordOne"
						value={passwordOne}
						onChange={this.onChange}
						type="password"
						placeholder={this.props.strings.passHint}
					/>
				</div>
				<div className="password">
					<p>{this.props.strings.confirmPassword}</p>
					<input
						name="passwordTwo"
						value={passwordTwo}
						onChange={this.onChange}
						type="password"
						placeholder={this.props.strings.confirmPassHint}
					/>
				</div>
				<button className="submitChange" disabled={isInvalid} type="submit">
					{this.props.strings.changePassword}
				</button>
				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

export default compose(
	withFirebase,
	useLocalization
)(PasswordChangeForm);
