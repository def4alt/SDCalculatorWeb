import React, { Component } from "react";

import Read, { ReadModel } from "./reader";
import GetStatistics, { StatisticsModel } from "./statistics";

import Firebase, { withFirebase } from "../Firebase";
import { MdEdit, MdDone } from "react-icons/md";

import "./index.scss";

import * as WestgardRules from "./WestgardRules";

import { useLocalization, stringsType } from "../Localization";

type CalculationPageProps = {
	statisticsModels: StatisticsModel[];
	firebase: Firebase;
	callback: (data: any) => void;
	strings: stringsType;
};

type CalculationPageState = {
	files: FileList | null;
	backups: Array<{ lot: string; models: StatisticsModel[] }>;
	sdMode: boolean;
	lotSelected: boolean;
	globalStatisticsModels: StatisticsModel[];
	isLoading: boolean;
	lot: string;
	error: string;
	editLot: boolean;
};

class CalculationPage extends Component<
	CalculationPageProps,
	CalculationPageState
> {
	listener?: EventListener;

	constructor(props: CalculationPageProps) {
		super(props);
		this.state = {
			files: null,
			backups: [],
			sdMode: true,
			lotSelected: false,
			globalStatisticsModels: [],
			isLoading: false,
			lot: "",
			error: "",
			editLot: false
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleLotChange = this.handleLotChange.bind(this);
		this.handleFilesChange = this.handleFilesChange.bind(this);
		this.handleCheckChange = this.handleCheckChange.bind(this);
		this.handleBackupLot = this.handleBackupLot.bind(this);
	}

	componentDidUpdate(prevProps: CalculationPageProps) {
		if (this.props.statisticsModels !== prevProps.statisticsModels) {
			this.setState({
				globalStatisticsModels: this.props.statisticsModels
			});
		}
	}

	componentDidMount() {
		this.listener = this.props.firebase.auth.onAuthStateChanged(
			(authUser: firebase.User | null) =>
				authUser
					? this.props.firebase
							.backup(authUser.uid)
							.once("value", (snapshot: any) => {
								const backupsObject = snapshot.val();

								if (backupsObject) {
									const backupsList = Object.keys(
										backupsObject
									)
										.filter(
											key =>
												key !== "isDark" &&
												key !== "details"
										)
										.map(key => ({
											...backupsObject[key],
											lot: key
										}));

									this.setState({ backups: backupsList });
								}
							})
					: null
		);
	}

	componentWillUnmount() {
		this.listener = undefined;
		this.props.firebase.auth.currentUser &&
			this.props.firebase
				.backup(this.props.firebase.auth.currentUser.uid)
				.off();
	}

	getFileExtension = (filename: string) => {
		return filename.split(".").pop();
	};

	async calculate(files: FileList) {
		var parsedRows: ReadModel[] = [];
		for (const file of files) {
			if (this.getFileExtension(file.name) !== "xlsx") {
				if (this.getFileExtension(file.name) !== "xls") {
					this.setState({
						error: this.props.strings.wrongExtensionError,
						isLoading: false
					});
					return;
				}
			}

			await Read(file).then(parsed => {
				for (const model of parsed as ReadModel[]) {
					parsedRows.push(model);
				}
			});
		}

		if (parsedRows.length === 0) {
			this.setState({
				error: this.props.strings.wrongFormatError,
				isLoading: false
			});
		}

		var statisticsModels = GetStatistics(parsedRows);
		let globalStatisticsModels = Array.from(
			this.state.globalStatisticsModels
		);

		if (statisticsModels === undefined || statisticsModels.length === 0) {
			this.setState({
				error: this.props.strings.wrongFormatError,
				isLoading: false
			});
			return;
		}

		if (!this.state.sdMode) {
			for (let i = 0; i < statisticsModels.length; i++) {
				const model = statisticsModels[i];

				var globalModel = globalStatisticsModels.filter(
					t =>
						t.TestName === model.TestName &&
						t.SampleType === model.SampleType
				)[0];

				if (globalModel !== undefined) {
					globalModel.Average.push(model.Average[0]);
					globalModel.Date.push(model.Date[0]);
				}

				let warning = WestgardRules.CheckValues(
					globalModel.Average,
					globalModel.StandardDeviation
				);

				if (
					warning !==
					globalModel.Warning[globalModel.Warning.length - 1]
				)
					globalModel.Warning.push(warning);
				else globalModel.Warning.push(" ");
			}
		} else {
			globalStatisticsModels = statisticsModels;
		}

		if (this.state.lot === "") {
			this.setState({ lot: "0" });
		}

		if (this.props.firebase.auth.currentUser) {
			const backups = this.props.firebase.backup(
				this.props.firebase.auth.currentUser.uid
			);

			backups.on("value", (snapshot: any) => {
				var backupsObject = snapshot.val();
				backups.set({
					...backupsObject,
					[this.state.lot]: {
						models: globalStatisticsModels
					}
				});
			});
		}

		this.props.callback({
			statisticsModels: globalStatisticsModels,
			lot: this.state.lot
		});
		this.setState({ error: "", isLoading: false });
	}

	handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ files: event.currentTarget.files });
	};

	handleLotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!this.state.editLot && event.currentTarget.value !== "")
			this.setState({ lot: event.target.value });
	};

	handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ sdMode: event.target.checked });
	};

	handleEditLot = () => {
		if (this.state.editLot) {
			var newLotValue = (document.querySelector(
				".lot"
			) as HTMLInputElement).value;

			newLotValue = newLotValue === "" ? "0" : newLotValue;

			const currentUser = this.props.firebase.auth.currentUser;
			const currentLot = this.state.lot;

			if (currentUser && newLotValue && this.state.lot !== "") {
				this.props.firebase
					.backup(currentUser.uid)
					.once("value", (snapshot: any) => {
						const backupsObject = snapshot.val()[currentLot];

						this.props.firebase.backup(currentUser.uid).set({
							[newLotValue]: backupsObject,
							[currentLot]: {}
						});
					});

				this.setState({ lot: newLotValue });
			}
			this.setState({ editLot: false });
		} else {
			this.setState({ editLot: true });
		}
	};

	handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		if (
			this.state.files &&
			this.state.files.length !== 0 &&
			!this.state.lotSelected
		) {
			this.setState({ isLoading: true });
			this.calculate(this.state.files);
		}
		this.setState({ lotSelected: false });
		event.preventDefault();
	};

	handleBackupLot = (backup: any) => {
		this.props.callback({
			statisticsModels: backup.models,
			lot: backup.lot
		});
		this.setState({
			lotSelected: true,
			lot: backup.lot
		});
	};

	render() {
		return (
			<div className="center calculation">
				<form onSubmit={this.handleSubmit}>
					{this.state.error !== "" && <p>{this.state.error}</p>}

					<div className="lotBox">
						<span className="lotSpan">
							{this.props.strings.lot}
						</span>
						<div className="dropdown">
							<input
								type="number"
								className="lot"
								placeholder="e.g. 1214"
								value={
									!this.state.editLot
										? this.state.lot
										: undefined
								}
								onChange={this.handleLotChange}
							/>
							{!this.state.editLot && (
								<div className="dropdown-content">
									{this.state.backups.map(backup => (
										<button
											key={backup.lot}
											onClick={() =>
												this.handleBackupLot(backup)
											}
										>
											{backup.lot}
										</button>
									))}
								</div>
							)}
						</div>
						{this.state.lot !== "" &&
							this.props.firebase.auth.currentUser && (
								<button
									className="editLotButton"
									hidden={this.state.lotSelected}
									type="button"
									onClick={() => this.handleEditLot()}
								>
									{this.state.editLot ? (
										<MdDone />
									) : (
										<MdEdit />
									)}
								</button>
							)}
					</div>

					<div className="switchBox">
						<label className="addAverageLabel">
							{this.props.strings.addAverage}
						</label>
						<label className="switch">
							<input
								type="checkbox"
								checked={this.state.sdMode}
								onChange={this.handleCheckChange}
							/>
							<span className="slider round"></span>
						</label>
						<label className="buildChartsLabel">
							{this.props.strings.buildCharts}
						</label>
					</div>

					<div>
						<p>{this.props.strings.selectFiles + ":"}</p>
						<label className="file">
							<input
								type="file"
								id="file"
								aria-label="File browser example"
								multiple={this.state.sdMode}
								onChange={this.handleFilesChange}
							/>
							<span
								className={
									"file-custom " +
									this.props.strings.browseFiles
								}
							>
								{this.state.files &&
									(this.state.files.length > 1
										? this.state.files.length +
										  this.props.strings.filesSelected
										: this.state.files.length === 0
										? ""
										: this.state.files[0].name)}
							</span>
						</label>
					</div>
					<button
						className="calcButton"
						disabled={this.state.isLoading}
						onClick={() =>
							!this.state.isLoading ? this.handleSubmit : null
						}
					>
						{this.state.sdMode
							? this.state.isLoading
								? this.props.strings.buildingCharts
								: this.props.strings.buildCharts
							: this.state.isLoading
							? this.props.strings.addingAverage
							: this.props.strings.addAverage}
					</button>
				</form>
			</div>
		);
	}
}

export default withFirebase(useLocalization(CalculationPage));
