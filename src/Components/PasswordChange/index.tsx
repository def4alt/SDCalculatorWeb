import React from "react";

import "./index.scss";
import Firebase, { withFirebase } from "../Firebase";
import { stringsType, useLocalization } from "../Localization";

const INITIAL_STATE = {
	passwordOne: "",
	passwordTwo: "",
	error: ""
};

type PasswordChangeFormProps = {
	firebase: Firebase;
	strings: stringsType;
};

type PasswordChangeFormState = {
	[x: string]: string;
	passwordOne: string;
	passwordTwo: string;
	error: string;
};

class PasswordChangeForm extends React.Component<
	PasswordChangeFormProps,
	PasswordChangeFormState
> {
	constructor(props: PasswordChangeFormProps) {
		super(props);

		this.state = { ...INITIAL_STATE };

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const { passwordOne } = this.state;

		const passwordUpdate = this.props.firebase.doPasswordUpdate(
			passwordOne
		);

		passwordUpdate &&
			passwordUpdate
				.then(() => {
					this.setState({ ...INITIAL_STATE });
				})
				.catch(error => {
					this.setState({ error: error.message });
				});

		event.preventDefault();
	};

	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			[event.currentTarget.name]: event.currentTarget.value
		});

		event.preventDefault();
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
				<button
					className="submitChange"
					disabled={isInvalid}
					type="submit"
				>
					{this.props.strings.changePassword}
				</button>
				{<p>{error}</p>}
			</form>
		);
	}
}

export default withFirebase(useLocalization(PasswordChangeForm));
