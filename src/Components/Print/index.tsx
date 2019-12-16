import React from "react";
import Firebase, { withFirebase } from "../Firebase";
import { stringsType, useLocalization } from "../Localization";
import { StatisticsModel } from "../Calculation/statistics";
import CardTemplate from "../Cards/CardsTemplate";

import "./index.scss";

type PrintPageProps = {
	firebase: Firebase;
	lot: string;
	strings: stringsType;
	componentRef: React.Ref<HTMLDivElement>;
};

type PrintPageState = {
	lot: string;
	date: string;
	lastname: string;
	innerWidth: number;
	notes: string;
	units: string;
	deviceName: string;
	models: StatisticsModel[];
};

class PrintPage extends React.Component<PrintPageProps, PrintPageState> {
	listener?: EventListener;

	constructor(props: PrintPageProps) {
		super(props);

		this.state = {
			lot: this.props.lot,
			date: "",
			lastname: "",
			innerWidth: 0,
			notes: "",
			units: "",
			deviceName: "",
			models: []
		};
	}

	componentWillUnmount() {
		this.listener = undefined;
		if (this.props.firebase.auth.currentUser) {
			this.props.firebase
				.backup(this.props.firebase.auth.currentUser.uid)
				.off();
		}
	}

	componentDidMount() {
		this.listener = this.props.firebase.auth.onAuthStateChanged(
			authUser =>
				authUser &&
				this.props.firebase
					.backup(authUser.uid)
					.on("value", snapshot => {
						const object = snapshot.val()[this.state.lot];

						this.setState({
							models: object.models
						});

						if (object.details) {
							this.setState({
								date: object.details.date,
								lastname: object.details.lastname,
								notes: object.details.notes,
								units: object.details.units,
								deviceName: object.details.deviceName
							});
						}
					})
		);
	}

	render() {
		var cards = Array.from(this.state.models).map(model => (
			<CardTemplate
				cardWidth={this.state.innerWidth}
				key={model.TestName + model.SampleType}
				model={model}
				editMode={false}
				showStarredCharts={false}
			/>
		));

		return (
			<div ref={this.props.componentRef} className="printRoot">
				<div className="infoBox">
					<div className="detailsBox">
						<h3>{this.props.strings.details}</h3>
						<div className="detailsContent">
							<p>
								{this.props.strings.date}: {this.state.date}
							</p>
							<hr />
							<p>
								{this.props.strings.lot}: {this.state.lot}
							</p>
							<hr />
							<p>
								{this.props.strings.lastname}:{" "}
								{this.state.lastname}
							</p>
							<hr />
							<p>
								{this.props.strings.deviceName}:{" "}
								{this.state.deviceName}
							</p>
							<hr />
							<p>
								{this.props.strings.units}: {this.state.units}
							</p>
							<hr />
							<p>
								{this.props.strings.notes}: {this.state.notes}
							</p>
						</div>
					</div>
				</div>
				<div className="cardsHolder center">{cards}</div>
			</div>
		);
	}
}

export default useLocalization(withFirebase(PrintPage));
