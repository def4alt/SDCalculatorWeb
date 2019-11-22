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
							const backupsObject = snapshot.val();

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
			if (this.props.firebase.auth.currentUser) {
				var backupsObject = {};

				const backups = this.props.firebase.backup(
					this.props.firebase.auth.currentUser.uid
				);

				backups.on(
					"value",
					snapshot => (backupsObject = snapshot.val())
				);

				const date = (document.querySelector(
					".dateInput"
				) as HTMLInputElement).value;
				const lastname = (document.querySelector(
					".lastnameInput"
				) as HTMLInputElement).value;
				const deviceName = (document.querySelector(
					".deviceNameInput"
				) as HTMLInputElement).value;
				const units = (document.querySelector(
					".unitsInput"
				) as HTMLInputElement).value;
				const notes = (document.querySelector(
					".notesInput"
				) as HTMLTextAreaElement).value;

				backups.set({
					...backupsObject,
					details: {
						lot: this.state.lot,
						date: date,
						deviceName: deviceName,
						lastname: lastname,
						notes: notes,
						units: units
					}
				});

				event.preventDefault();
			}
		};

		return (
			<div className="cardsRoot">
				<div className="infoBox">
					<div className="detailsBox">
						<h5>{this.props.strings.details}</h5>
						<div className="detailsContent">
							<form onSubmit={handleDetailsChange}>
								<label>{this.props.strings.date}:</label>
								<input
									className="dateInput"
									type="text"
									defaultValue={this.state.date}
									name="date"
								/>
								<hr />
								<label>
									{this.props.strings.lot}: {this.state.lot}
								</label>
								<hr />
								<label>{this.props.strings.lastname}:</label>
								<input
									className="lastnameInput"
									type="text"
									defaultValue={this.state.lastname}
									name="lastname"
								/>
								<hr />
								<label>{this.props.strings.deviceName}:</label>
								<input
									className="deviceNameInput"
									type="text"
									defaultValue={this.state.deviceName}
									name="deviceName"
								/>
								<hr />
								<label>{this.props.strings.units}:</label>
								<input
									className="unitsInput"
									type="text"
									defaultValue={this.state.units}
									name="units"
								/>

								<hr />
								<label>{this.props.strings.notes}:</label>
								<textarea
									className="notesInput"
									defaultValue={this.state.notes}
									name="notes"
								/>
								<button type="submit" className="updateButton">
									{this.props.strings.update}
								</button>
							</form>
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
