import React from "react";
import { LocalizationContext, strings } from "./index";
import { withCookies } from "react-cookie";

const withLocalization = Component => {
	class WithLocalization extends React.Component {
		constructor(props) {
			super(props);
			this.setLocale = this.setLocale.bind(this);
			this.state = {
				strings: strings,
				setLocale: this.setLocale
			};

		}

		setLocale(code) {

			this.props.cookies.set(
				"lang",
				code,
				{ path: "/" }
			);
			this.state.strings.setLanguage(code);
			this.setState({});
		}

		componentDidMount() {
			const lang = this.props.cookies.get("lang");
			if (lang !== undefined)
				this.state.strings.setLanguage(lang);
		}

		render() {
			return (
				<LocalizationContext.Provider value={this.state}>
					<Component {...this.props} />
				</LocalizationContext.Provider>
			);
		}
	}

	return withCookies(WithLocalization);
};

export default withLocalization;
