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
	displayCalc: boolean;
};

class HomePage extends Component<HomePageProps, HomePageState> {
	constructor(props: HomePageProps) {
		super(props);

		this.state = {
			statisticsModels: [],
			date: "",
			lot: "",
			displayCalc: true
		};

		this.handleScroll = this.handleScroll.bind(this);
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

	componentDidMount() {
		window.addEventListener("scroll", this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
	}

	handleScroll() {
		let scrollTop = window.scrollY;
		if (
			scrollTop > window.outerHeight / 2 &&
			this.state.displayCalc &&
			this.state.statisticsModels.length > 0
		) {
			window.scrollTo(0, 0);
			this.setState({ displayCalc: false });
		}
	}

	render() {
		return (
			<div className="homeRoot">
				<div
					className="calculationBox"
					hidden={!this.state.displayCalc}
				>
					<Calculation
						callback={this.myCallback}
						statisticsModels={this.state.statisticsModels}
					/>
				</div>
				<div className="arrowBtn" hidden={this.state.displayCalc}>
					<button
						onClick={() => this.setState({ displayCalc: true })}
					>
						<i className="arrow up"></i>
					</button>
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
