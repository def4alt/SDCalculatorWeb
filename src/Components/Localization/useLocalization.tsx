import { LocalizationContext, stringsType } from "./index";
import React from "react";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type useLocalizationProps = {
	strings: stringsType,
	setLocale: (code: string) => void
}

const useLocalization = <P extends object>(
	Component: React.ComponentType<P>
): React.FC<Omit<P, keyof useLocalizationProps>> => props => (
	<LocalizationContext.Consumer>
		{({ strings, setLocale }) => (
			<Component
				{...(props as P)}
				strings={strings as stringsType}
				setLocale={setLocale}
			/>
		)}
	</LocalizationContext.Consumer>
);

export default useLocalization;