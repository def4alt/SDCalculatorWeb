import React, { Component, Suspense } from "react";
import { withAuthorization } from "../Session";

import Calculation from "../Calculation";

import "./index.scss";

import { useLocalization, stringsType } from "../Localization";
import { StatisticsModel } from "../Calculation/statistics";

const LazyCards = React.lazy(() => import("../Cards"));

type HomePageProps = {
	strings: stringsType;
};

type HomePageState = {
	statisticsModels: StatisticsModel[];
	date: string;
	lot: string;
};

class HomePage extends Component<HomePageProps, HomePageState> {
	constructor(props: HomePageProps) {
		super(props);

		this.state = {
			statisticsModels: [],
			date: "",
			lot: ""
		};
	}
	myCallback = (dataFromChild: {
		statisticsModels: StatisticsModel[];
		lot: string;
	}) => {
		this.setState({
			statisticsModels: dataFromChild.statisticsModels,
			date: dataFromChild.statisticsModels[0].Date[0],
			lot: dataFromChild.lot
		});
	};

	render() {
		return (
			<div className="homeRoot">
				<div className="calculationBox">
					<Calculation
						callback={this.myCallback}
						statisticsModels={this.state.statisticsModels}
					/>
				</div>

				{this.state.statisticsModels.length > 0 && (
					<div>
						<Suspense
							fallback={<div className="loadingCircle"></div>}
						>
							<LazyCards
								lot={this.state.lot}
								date={this.state.date}
								statisticsModels={this.state.statisticsModels}
							/>
						</Suspense>
					</div>
				)}
			</div>
		);
	}
}

export default withAuthorization(authUser => (authUser !== null ? true : true))(
	useLocalization(HomePage)
);
