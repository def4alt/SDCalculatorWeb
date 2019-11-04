import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { compose } from "recompose";
import { useLocalization } from "../Localization";

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
			<Form onSubmit={this.onSubmit} style={{ marginRight: "60vw" }}>
				<Form.Group>
					<Form.Label>{this.props.strings.password}</Form.Label>
					<Form.Control
						name="passwordOne"
						value={passwordOne}
						onChange={this.onChange}
						type="password"
						placeholder={this.props.strings.passHint}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>{this.props.strings.confirmPassword}</Form.Label>
					<Form.Control
						name="passwordTwo"
						value={passwordTwo}
						onChange={this.onChange}
						type="password"
						placeholder={this.props.strings.confirmPassHint}
					/>
				</Form.Group>
				<Button disabled={isInvalid} type="submit">
					{this.props.strings.changePassword}
				</Button>
				{error && <p>{error.message}</p>}
			</Form>
		);
	}
}

export default compose(
	withFirebase,
	useLocalization
)(PasswordChangeForm);
