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
			notes: "",
			units: "",
			deviceName: "",
			models: []
		};
	}

	componentDidMount() {
		this.listener = this.props.firebase.auth.onAuthStateChanged(
			authUser =>
				authUser &&
				this.props.firebase
					.backup(authUser.uid)
					.on("value", snapshot => {
						const object = snapshot.val();

						this.setState({
							models: object[this.state.lot].models
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
						<h5>{this.props.strings.details}</h5>
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
					<div className="abbreviations">
						<h5>{this.props.strings.abbreviations}</h5>
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
				</div>
				<div className="cardsHolder center">{cards}</div>
			</div>
		);
	}
}

export default useLocalization(withFirebase(PrintPage));
