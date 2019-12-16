import React from "react";
import {
	stringsType,
	LocalizationContext,
	useLocalization
} from "../Localization";
import { RouterProps, withRouter } from "react-router";
import Firebase, { withFirebase } from "../Firebase";
import * as ROUTES from "../../Constants/routes";

import "./index.scss";

type SignUpPageProps = {
	strings: stringsType;
};

const SignUpPage: React.SFC<SignUpPageProps> = props => (
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
	error: ""
};

interface SignUpFormBaseProps extends RouterProps {
	firebase: Firebase;
	strings: stringsType;
}

type SignUpFormBaseState = {
	[x: string]: string;
	username: string;
	email: string;
	passwordOne: string;
	passwordTwo: string;
	error: string;
};

class SignUpFormBase extends React.Component<
	SignUpFormBaseProps,
	SignUpFormBaseState
> {
	constructor(props: SignUpFormBaseProps) {
		super(props);

		this.state = { ...INITIAL_STATE };
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const { username, email, passwordOne } = this.state;

		this.props.firebase
			.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
				return (
					authUser.user &&
					this.props.firebase
						.user(authUser.user.uid)
						.set({ username, email })
				);
			})
			.then(() => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.LANDING);
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
				<p className="text-danger">{<p>{error}</p>}</p>
			</form>
		);
	}
}

const SignUpLink: React.SFC = () => (
	<LocalizationContext.Consumer>
		{({ strings }) => (
			<p>
				{(strings as stringsType).dontHave}{" "}
				<a href={ROUTES.SIGN_UP}>{(strings as stringsType).signUp}</a>
			</p>
		)}
	</LocalizationContext.Consumer>
);

const SignUpForm = withRouter(withFirebase(useLocalization(SignUpFormBase)));

export default useLocalization(SignUpPage);

export { SignUpForm, SignUpLink };
