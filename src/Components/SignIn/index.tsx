import React from "react";
import { stringsType, useLocalization } from "../Localization";
import { RouterProps, withRouter } from "react-router";
import Firebase, { withFirebase } from "../Firebase";
import * as ROUTES from "../../Constants/routes";

import "./index.scss";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";

type SignInPageProps = {
	strings: stringsType;
};

const SignInPage: React.SFC<SignInPageProps> = props => (
	<div className="signInBox">
		<h1>{props.strings.signIn}</h1>
		<SignInForm />
		<PasswordForgetLink strings={props.strings}/>
		<SignUpLink />
	</div>
);

const INITIAL_STATE = {
	email: "",
	password: "",
	error: ""
};

interface SignInFormState {
	[x: string]: string;
	email: string;
	password: string;
	error: string;
}

interface SignInFormProps extends RouterProps {
	strings: stringsType;
	firebase: Firebase;
}

class SignInFormBase extends React.Component<SignInFormProps, SignInFormState> {
	listener?: EventListener;

	constructor(props: SignInFormProps) {
		super(props);

		this.state = { ...INITIAL_STATE };
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		this.listener = this.props.firebase.auth.onAuthStateChanged(
			(authUser: firebase.User | null) =>
				authUser && this.props.history.push(ROUTES.HOME)
		);
	}

	componentWillUnmount() {
		this.listener = undefined;
	}

	onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const { email, password } = this.state;

		this.props.firebase
			.doSignInWithEmailAndPassword(email, password)
			.then(() => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				this.setState({ error: error.message });
			});

		event.preventDefault();
	};

	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target)
			this.setState({
				[event.currentTarget.name]: event.currentTarget.value
			});
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

				<p className="text-danger">{error}</p>
			</form>
		);
	}
}

const SignInForm = withRouter(withFirebase(useLocalization(SignInFormBase)));

export default useLocalization(SignInPage);
export { SignInForm };
