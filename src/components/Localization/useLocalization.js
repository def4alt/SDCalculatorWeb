import { LocalizationContext } from "./index";
import React from "react";

const useLocalization = Component => props => (
	<LocalizationContext.Consumer>
		{({strings, setLocale}) => <Component {...props} strings={strings} setLocale={setLocale}/>}
	</LocalizationContext.Consumer>
);

export default useLocalization;