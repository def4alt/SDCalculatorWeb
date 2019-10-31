import React from "react";
import { ThemeContext, themes } from "./index";
import { withFirebase } from "../Firebase";
import { withCookies } from "react-cookie";

const withTheme = Component => {
	class WithTheme extends React.Component {
		constructor(props) {
			super(props);

			this.toggleTheme = this.toggleTheme.bind(this);

			this.state = {
				theme: themes.light,
				toggleTheme: this.toggleTheme
			};
		}

		toggleTheme() {
			this.setState(state => ({
				theme: state.theme === themes.dark ? themes.light : themes.dark
			}));

			if (this.props.firebase.auth.currentUser) {
				const backups = this.props.firebase.backup(
					this.props.firebase.auth.currentUser.uid
				);

				var backupsObject;
				backups.on("value", snapshot => backupsObject = snapshot.val());
				backups.set({
					...backupsObject,
					theme: this.state.theme === themes.dark ? "light" : "dark"
				});
			}

			this.props.cookies.set(
				"theme",
				this.state.theme === themes.dark ? "dark" : "light",
				{ path: "/" }
			);
		}

		componentDidMount() {
			const { cookies } = this.props;
			const theme = cookies.get("theme");

			if (theme !== "" && theme !== undefined) {
				this.setState({
					theme: theme.theme === "light" ? themes.light : themes.dark
				});
			} else {
				if (this.props.firebase.auth.currentUser)
					this.props.firebase
						.backup(this.props.firebase.auth.currentUser.uid)
						.on("value", snapshot => {
							this.setState({
								theme:
									snapshot.val().theme === "light"
										? themes.light
										: themes.dark
							});
						});
			}
		}

		render() {
			return (
				<ThemeContext.Provider value={this.state}>
					<Component {...this.props} />
				</ThemeContext.Provider>
			);
		}
	}

	return withCookies(withFirebase(WithTheme));
};

export default withTheme;
