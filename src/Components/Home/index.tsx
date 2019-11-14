import React, { Component, Suspense } from "react";
import { withAuthorization } from "../Session";

import Calculation from "../Calculation";

import "./index.scss";

import { useLocalization, stringsType } from "../Localization";
import { StatisticsModel } from "../Calculation/statistics";

const LazyCards = React.lazy(() => import("../Cards"));

type HomePageProps = {
    strings: stringsType
}

type HomePageState = {
    statisticsModels: StatisticsModel[],
    showCharts: boolean,
    date: string,
    lot: string,
    displayCalc: boolean
}

class HomePage extends Component<HomePageProps, HomePageState> {
	constructor(props: HomePageProps) {
		super(props);

		this.state = {
			statisticsModels: [],
			showCharts: true,
			date: "",
			lot: "",
			displayCalc: true
		};

		this.handleScroll = this.handleScroll.bind(this);
	}
	myCallback = (dataFromChild: {statisticsModels: StatisticsModel[], lot: string}) => {
		this.setState({ statisticsModels: dataFromChild.statisticsModels });

		if (dataFromChild.statisticsModels.length > 0) {
			this.setState({ showCharts: false });
		}

		this.setState({ date: dataFromChild.statisticsModels[0].Date[0] });

		this.setState({ lot: dataFromChild.lot });
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
			<div
				className="homeRoot"
				style={{ paddingTop: this.state.displayCalc ? 0 : 100 }}
			>
				<div>
					<div hidden={!this.state.displayCalc}>
						<Calculation
							callback={this.myCallback}
							statisticsModels={this.state.statisticsModels}
						/>
					</div>
					<div className="arrowBtn" hidden={this.state.displayCalc}>
						<button
							style={{
								height: 25,
								backgroundColor: "transparent",
								borderColor: "transparent"
							}}
							onClick={() => this.setState({ displayCalc: true })}
						>
							<i className="arrow up"></i>
						</button>
					</div>
				</div>

				{this.state.statisticsModels.length > 0 && (
					<div className="infoBox">
						<div className="detailsBox">
							<h5>{this.props.strings.details}</h5>
							<div className="detailsContent">
								<p>
									{this.props.strings.date}: {this.state.date}
								</p>
								<hr />
								<p>
									{this.props.strings.lot}: {this.state.lot}
								</p>
							</div>
						</div>
						<div className="abbreviations">
							<h5>Abbreviations</h5>
							<div className="abbreviationsContent">
								<h6>13S</h6>
								<p>{this.props.strings.abr13S}</p>
								<hr />
								<h6>22S</h6>
								<p>{this.props.strings.abr22S}</p>
								<hr />
								<h6>R4S</h6>
								<p>{this.props.strings.abrR4S}</p>
								<hr />
								<h6>41S</h6>
								<p>{this.props.strings.abr41S}</p>
								<hr />
								<h6>8X</h6>
								<p>{this.props.strings.abr8X}</p>
							</div>
						</div>
						<Suspense
							fallback={<div className="loadingCircle"></div>}
						>
							<LazyCards
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
