import React, { Component } from "react";

import Read from "./reader";
import GetStatistics from "./statistics";

import { withFirebase } from "../Firebase";

import "./index.scss";

import * as WestgardRules from "./WestgardRules";

import { compose } from "recompose";
import { useLocalization } from "../Localization";

class CalculationPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			backups: [],
			sdMode: true,
			lotSelected: false,
			globalStatisticsModels: [],
			isLoading: false,
			lot: "",
			error: ""
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleLotChange = this.handleLotChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCheckChange = this.handleCheckChange.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.statisticsModels !== prevProps.statisticsModels) {
			this.setState({
				globalStatisticsModels: this.props.statisticsModels
			});
		}
	}

	componentDidMount() {
		this.listener = this.props.firebase.auth.onAuthStateChanged(authUser =>
			authUser
				? this.props.firebase
						.backup(authUser.uid)
						.on("value", snapshot => {
							const backupsObject = snapshot.val();

							if (backupsObject) {
								const backupsList = Object.keys(backupsObject)
									.filter(key => key !== "isDark")
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
		this.listener();
		this.props.firebase
			.backup(this.props.firebase.auth.currentUser.uid)
			.off();
	}

	getFileExtension(filename) {
		return filename.split(".").pop();
	}

	async calculate(files) {
		var parsedRows = [];
		for (const file of files) {
			if (this.getFileExtension(file.name) !== "xlsx") {
				if (this.getFileExtension(file.name) !== "xls") {
					this.setState({
						error:
							"Wrong file extension! Use only .xls, .xlsx files.",
						isLoading: false
					});
					return;
				}
			}

			await Read(file).then(parsed => {
				for (const model of parsed) {
					parsedRows.push(model);
				}
			});
		}

		if (parsedRows.length === 0) {
			this.setState({
				error: "Wrong file format!",
				isLoading: false
			});
		}

		var statisticsModels = GetStatistics(parsedRows);
		let globalStatisticsModels = Array.from(
			this.state.globalStatisticsModels
		);

		if (statisticsModels === undefined || statisticsModels.length === 0) {
			this.setState({
				error: "Wrong file format!",
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
					globalModel.Average.push(model.Average);
					globalModel.Date.push(model.Date);
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

			var backupsObject;
			backups.on("value", snapshot => (backupsObject = snapshot.val()));

			backups.set({
				...backupsObject,
				[this.state.lot]: {
					models: globalStatisticsModels
				}
			});
		}

		this.props.callback({
			statisticsModels: globalStatisticsModels,
			lot: this.state.lot
		});
		this.setState({ error: "", isLoading: false });
	}

	handleChange = event => {
		this.setState({ files: event.target.files });
	};

	handleLotChange = event => {
		this.setState({ lot: event.target.value });
	};

	handleCheckChange = event => {
		this.setState({ sdMode: event.target.checked });
	};

	handleSubmit = event => {
		if (this.state.files.length !== 0 && !this.state.lotSelected) {
			this.setState({ isLoading: true });
			this.calculate(this.state.files);
		}
		this.setState({ lotSelected: false });
		event.preventDefault();
	};

	render() {
		return (
			<div className="center calculation">
				<form onSubmit={this.handleSubmit}>
					{this.state.error !== "" && <p>{this.state.error}</p>}
					<div>
						<span className="lotSpan">Lot</span>
						<div class="dropdown">
							<input
								type="number"
								className="lot"
								placeholder="e.g. 1214"
								value={this.state.lot}
								onChange={this.handleLotChange}
							/>
							<div class="dropdown-content">
								{this.state.backups.map(backup => (
									<button
										key={backup.lot}
										onClick={() => {
											this.props.callback({
												statisticsModels: backup.models,
												lot: backup.lot
											});
											this.setState({
												lotSelected: true,
												lot: backup.lot
											});
										}}
									>
										{backup.lot}
									</button>
								))}
							</div>
						</div>
					</div>

					<div className="switchBox">
						<label class="addAverageLabel">
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
						<label class="buildChartsLabel">
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
								onChange={this.handleChange}
							/>
							<span className="file-custom">
								{this.state.files.length > 1
									? this.state.files.length +
									this.props.strings.filesSelected
									: this.state.files.length === 0
									? ""
									: this.state.files[0].name}
							</span>
						</label>
					</div>
					<button
						className="calcButton"
						disabled={this.state.isLoading}
						onClick={
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

export default compose(
	withFirebase,
	useLocalization
)(CalculationPage);
