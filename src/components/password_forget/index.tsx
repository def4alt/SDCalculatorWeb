import React from "react";
import Firebase, { withFirebase } from "../../context/firebase";

import "../../styles/form/form.scss";

interface PasswordForgetProps {
    firebase: Firebase;
}
interface PasswordForgetState {
    email: string;
    error: string;
}

class PasswordForget extends React.Component<
    PasswordForgetProps,
    PasswordForgetState
> {
    constructor(props: PasswordForgetProps) {
        super(props);

        this.state = {
            email: "",
            error: "",
        };
    }

    onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        this.props.firebase
            .doPasswordReset(this.state.email)
            .then(() => {
                this.setState({ email: "", error: "" });
            })
            .catch((error) => {
                this.setState({ error });
            });
    };
    onEmailChange = (event: React.FocusEvent<HTMLInputElement>) => {
        this.setState({ email: event.currentTarget.value });
    };

    render() {
        let isInvalid = this.state.email === "";
        return (
            <form onSubmit={this.onSubmit} className="form">
                <div className="form__input">
                    <p>Email</p>
                    <input
                        name="email"
                        value={this.state.email}
                        onChange={this.onEmailChange}
                        type="text"
                        placeholder="example@example.com"
                    />
                </div>
                <button
                    className="form__submit"
                    disabled={isInvalid}
                    type="submit"
                >
                    Reset
                </button>
                <p className="form__error">{<p>{this.state.error}</p>}</p>
            </form>
        );
    }
}
export default withFirebase(PasswordForget);
