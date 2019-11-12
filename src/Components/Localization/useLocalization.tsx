import { LocalizationContext } from "./index";
import React from "react";

const useLocalization = <P extends object>(
	Component: React.ComponentType<P>
): React.FC<P> => props => (
	<LocalizationContext.Consumer>
		{({ strings, setLocale }) => (
			<Component
				{...(props as P)}
				strings={strings}
				setLocale={setLocale}
			/>
		)}
	</LocalizationContext.Consumer>
);

export default useLocalization;