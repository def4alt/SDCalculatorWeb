import React from "react";
import Firebase, { withFirebase } from "../Firebase";
import * as ROUTES from "../../Constants/routes";

import "./index.scss";

import { useLocalization, stringsType } from "../Localization";

type PasswordForgetPageProps = {
    strings: stringsType
}

const PasswordForgetPage: React.SFC<PasswordForgetPageProps> = props => (
	<div className="forgetPasswordBox">
		<h1>{props.strings.passwordForget}</h1>
		<PasswordForgetForm />
	</div>
);

const INITIAL_STATE = {
	email: "",
	error: ""
};

type PasswordForgetFormBaseProps = {
	firebase: Firebase;
	strings: stringsType;
};

type PasswordForgetFormBaseState = {
	[x: string]: string;
	email: string;
	error: string;
};

class PasswordForgetFormBase extends React.Component<
	PasswordForgetFormBaseProps,
	PasswordForgetFormBaseState
> {
	constructor(props: PasswordForgetFormBaseProps) {
		super(props);
		this.state = { ...INITIAL_STATE };

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
	};

	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ [event.target.name]: event.target.value });
	};

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
				<button
					className="submitForget"
					disabled={isInvalid}
					type="submit"
				>
					{this.props.strings.resetPassword}
				</button>
				<p className="text-danger">{<p>{error}</p>}</p>
			</form>
		);
	}
}

type PasswordForgetLinkProps = {
    strings: stringsType
}

const PasswordForgetLink: React.SFC<PasswordForgetLinkProps> = props => (
	<a href={ROUTES.PASSWORD_FORGET}>{props.strings.forgotPassword}</a>
);

export default useLocalization(PasswordForgetPage);

const PasswordForgetForm = useLocalization(
	withFirebase(PasswordForgetFormBase)
);

export { PasswordForgetForm, PasswordForgetLink };
