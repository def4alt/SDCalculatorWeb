import React from "react";
import { ThemeContext } from "./index";
import { withFirebase } from "../Firebase";
import { withCookies } from "react-cookie";

const withTheme = Component => {
	class WithTheme extends React.Component {
		constructor(props) {
			super(props);

			this.toggleTheme = this.toggleTheme.bind(this);

			this.state = {
				isDark: false,
				toggleTheme: this.toggleTheme
			};
		}

		toggleTheme() {
			const isDark = !this.state.isDark;
			this.setState({
				isDark: !this.state.isDark
			});

			if (this.props.firebase.auth.currentUser) {
				const backups = this.props.firebase.backup(
					this.props.firebase.auth.currentUser.uid
				);

				var backupsObject;
				backups.on(
					"value",
					snapshot => (backupsObject = snapshot.val())
				);

				backups.set({
					...backupsObject,
					isDark: JSON.stringify(isDark)
				});
			}

			const bodyEl = document.querySelector("body");

			isDark
				? bodyEl.classList.add("dark")
				: bodyEl.classList.remove("dark");

			this.props.cookies.set("isDark", JSON.stringify(isDark), {
				path: "/"
			});
		}

		componentDidMount() {
			const { cookies } = this.props;
			let isDark = cookies.get("isDark") === "true";

			if (isDark !== "" && isDark !== undefined) {
				this.setState({
					isDark: isDark
				});
			} else {
				this.listener = this.props.firebase.auth.onAuthStateChanged(
					authUser =>
						authUser
							? this.props.firebase
									.backup(authUser.uid)
									.on("value", snapshot => {
										this.setState({
											isDark:
												snapshot.val().isDark === "true"
										});
										isDark =
											snapshot.val().isDark === "true";
									})
							: null
				);
			}

			const bodyEl = document.querySelector("body");
			isDark
				? bodyEl.classList.add("dark")
				: bodyEl.classList.remove("dark");
		}

		componentWillUnmount() {
			this.listener();
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
