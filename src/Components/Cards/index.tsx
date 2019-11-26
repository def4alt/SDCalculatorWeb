import React from "react";

import "./index.scss";

import CardTemplate from "./CardsTemplate";
import { useLocalization, stringsType } from "../Localization";
import { StatisticsModel } from "../Calculation/statistics";
import PrintPage from "../Print";
import ReactToPrint from "react-to-print";
import Firebase, { withFirebase } from "../Firebase";

type CardsHolderProps = {
	statisticsModels: StatisticsModel[];
	strings: stringsType;
	lot: string;
	firebase: Firebase;
	date: string;
};

type CardsHolderState = {
	statisticsModels: StatisticsModel[];
	showStarredCharts: boolean;
	editMode: boolean;
	date: string;
	lot: string;
	lastname: string;
	notes: string;
	units: string;
	deviceName: string;
};

class CardsHolder extends React.Component<CardsHolderProps, CardsHolderState> {
	listener?: EventListener;
	private printObject: HTMLDivElement;

	constructor(props: CardsHolderProps) {
		super(props);

		this.state = {
			statisticsModels: props.statisticsModels,
			showStarredCharts: false,
			date: this.props.date,
			lot: this.props.lot,
			lastname: "",
			notes: "",
			units: "",
			deviceName: "",
			editMode: false
		};

		this.printObject = document.createElement("div");
	}

	componentDidUpdate(prevProps: CardsHolderProps) {
		if (this.props.statisticsModels !== prevProps.statisticsModels) {
			this.setState({ statisticsModels: this.props.statisticsModels });
		}
		if (this.props.date !== prevProps.date) {
			this.setState({ date: this.props.date });
		}
		if (this.props.lot !== prevProps.lot) {
			this.setState({ lot: this.props.lot });
		}
	}

	componentDidMount() {
		this.listener = this.props.firebase.auth.onAuthStateChanged(authUser =>
			authUser
				? this.props.firebase
						.backup(authUser.uid)
						.once("value", snapshot => {
							const backupsObject = snapshot.val()[
								this.state.lot
							];

							if (backupsObject && backupsObject.details) {
								this.setState({
									lot: backupsObject.details.lot,
									date: backupsObject.details.date,
									lastname: backupsObject.details.lastname,
									deviceName:
										backupsObject.details.deviceName,
									notes: backupsObject.details.notes,
									units: backupsObject.details.units
								});
							}
						})
				: null
		);
	}

	render() {
		var cards = Array.from(this.state.statisticsModels).map(model => {
			return (
				<CardTemplate
					key={model.TestName + model.SampleType}
					model={model}
					editMode={this.state.editMode}
					showStarredCharts={this.state.showStarredCharts}
				/>
			);
		});

		const handleDetailsChange = (
			event: React.ChangeEvent<HTMLFormElement>
		) => {
			event.preventDefault();
			if (this.props.firebase.auth.currentUser) {
				const backups = this.props.firebase.backup(
					this.props.firebase.auth.currentUser.uid
				);

				backups.on("value", snapshot => {
					const backupsObject = snapshot.val()[this.state.lot];

					const date = (event.currentTarget.querySelector(
						'input[name="date"]'
					) as HTMLInputElement).value;

					const lastname = (event.currentTarget.querySelector(
						'input[name="lastname"]'
					) as HTMLInputElement).value;

					const deviceName = (event.currentTarget.querySelector(
						'input[name="deviceName"]'
					) as HTMLInputElement).value;

					const units = (event.currentTarget.querySelector(
						'input[name="units"]'
					) as HTMLInputElement).value;

					const notes = (event.currentTarget.querySelector(
						'textarea[name="notes"]'
					) as HTMLTextAreaElement).value;

					backups.set({
						[this.state.lot]: {
							...backupsObject,
							details: {
								lot: this.state.lot,
								date: date,
								deviceName: deviceName,
								lastname: lastname,
								notes: notes,
								units: units
							}
						}
					});
				});
			}
		};

		const { date, lot, lastname, deviceName, units, notes } = this.state;

		return (
			<div className="cardsRoot">
				<div className="infoBox">
					<div className="detailsBox">
						<h3>{this.props.strings.details}</h3>
						<div className="detailsContent">
							<form onSubmit={handleDetailsChange}>
								<div className="date">
									<p>{this.props.strings.date}:</p>
									<input
										type="text"
										defaultValue={date}
										name="date"
									/>
								</div>
								<hr />
								<p>
									{this.props.strings.lot}: {lot}
								</p>
								<hr />
								<div className="lastname">
									<p>{this.props.strings.lastname}</p>
									<input
										type="text"
										defaultValue={lastname}
										name="lastname"
									/>
								</div>
								<hr />
								<div className="deviceName">
									<p>{this.props.strings.deviceName}</p>
									<input
										type="text"
										defaultValue={deviceName}
										name="deviceName"
									/>
								</div>
								<hr />

								<div className="units">
									<p>{this.props.strings.units}</p>
									<input
										type="text"
										defaultValue={units}
										name="units"
									/>
								</div>
								<hr />
								<div className="notes">
									<p>{this.props.strings.notes}</p>
									<textarea
										defaultValue={notes}
										name="notes"
									/>
								</div>
								<button type="submit" className="updateButton">
									{this.props.strings.update}
								</button>
							</form>
						</div>
					</div>
					<div className="abbreviations">
						<h3>{this.props.strings.abbreviations}</h3>
						<div className="abbreviationsContent">
							<h4>13S</h4>
							<p>{this.props.strings.abr13S}</p>
							<hr />
							<h4>22S</h4>
							<p>{this.props.strings.abr22S}</p>
							<hr />
							<h4>R4S</h4>
							<p>{this.props.strings.abrR4S}</p>
							<hr />
							<h4>41S</h4>
							<p>{this.props.strings.abr41S}</p>
							<hr />
							<h4>8X</h4>
							<p>{this.props.strings.abr8X}</p>
						</div>
					</div>
				</div>
				<div className="border-bottom links-box center">
					<button
						className="link-button"
						onClick={() =>
							this.setState({
								showStarredCharts: !this.state.showStarredCharts
							})
						}
					>
						{this.props.strings.toggleStarred}
					</button>
					<button
						className="link-button"
						onClick={() =>
							this.setState({ editMode: !this.state.editMode })
						}
					>
						{this.props.strings.toggleEdit}
					</button>
					<ReactToPrint
						trigger={() => (
							<button
								className="link-button"
								onClick={() =>
									this.setState({
										editMode: !this.state.editMode
									})
								}
							>
								{this.props.strings.print}
							</button>
						)}
						content={() => this.printObject}
					/>
				</div>
				<div style={{ display: "none" }}>
					<PrintPage
						lot={this.props.lot}
						componentRef={el => el && (this.printObject = el)}
					/>
				</div>
				<div className="cardsHolder center">{cards}</div>
			</div>
		);
	}
}

export default withFirebase(useLocalization(CardsHolder));
