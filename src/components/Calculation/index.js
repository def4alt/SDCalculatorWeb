import React, { Component } from "react";

import Read from "./reader";
import GetStatistics from "./statistics";

import { withFirebase } from "../Firebase";

import Alert from "react-bootstrap/Alert";

import "./index.css";

class CalculationPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			sdMode: true,
			globalStatisticsModels: [],
			isLoading: false,
			fileNames: [],
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

	getFileExtension(filename) {
		return filename.split(".").pop();
	}

	calculate(files) {
		return new Promise(async res => {
			var parsedRows = [];
			for (const file of files) {
				if (this.getFileExtension(file.name) != "xlsx") {
					if (this.getFileExtension(file.name) != "xls") {
						console.log(this.getFileExtension(file.name));
						this.setState({
							error:
								"Wrong file extension! Use only .xls, .xlsx files.",
							isLoading: false
						});
						res(null);
						return;
					}
				}

				await Read(file).then(parsed => {
					for (const model of parsed) {
						parsedRows.push(model);
					}
				});
			}
			var statisticsModels = GetStatistics(parsedRows, []);
			let globalStatisticsModels = Array.from(
				this.state.globalStatisticsModels
			);

			if (statisticsModels === undefined) {
				res(null);
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
				}
			} else {
				globalStatisticsModels = statisticsModels;
			}

			console.log(globalStatisticsModels);

			this.props.callback({
				statisticsModels: globalStatisticsModels,
				lot: this.state.lot
			});

			if (this.props.firebase.auth.currentUser)
				this.props.firebase
					.backup(this.props.firebase.auth.currentUser.uid)
					.set({
						backup: globalStatisticsModels,
						lot: this.state.lot
					});

			this.setState({ error: "" });
			res(globalStatisticsModels);
		});
	}

	handleChange(event) {
		this.setState({ files: event.target.files });
	}

	handleLotChange(event) {
		if (Number.parseInt(event.target.value) !== NaN) {
			this.setState({ lot: event.target.value });
		}
	}

	handleCheckChange(event) {
		this.setState({ sdMode: event.target.checked });
	}

	handleSubmit(event) {
		this.setState({ isLoading: true });
		this.calculate(this.state.files).then(() => {
			this.setState({ isLoading: false });
		});
		event.preventDefault();
	}

	render() {
		return (
			<div className="center">
				<form onSubmit={this.handleSubmit}>
					{this.state.error !== "" && (
						<Alert variant="danger">{this.state.error}</Alert>
					)}
					<div className="lot">
						<input
							type="number"
							value={this.state.lot}
							onChange={this.handleLotChange}
							placeholder="Lot"
						/>
						<span></span>
					</div>
					<div className="center">
						<label style={{ paddingRight: 20 }}>Add average</label>
						<label className="switch">
							<input
								type="checkbox"
								checked={this.state.sdMode}
								onChange={this.handleCheckChange}
							/>
							<span className="slider round"></span>
						</label>
						<label style={{ paddingLeft: 20 }}>Build charts</label>
					</div>

					<div style={{ paddingTop: 20 }}>
						<p>
							{this.state.sdMode
								? "Select files:"
								: "Select file:"}
						</p>
						<label className="file">
							<input
								type="file"
								id="file"
								aria-label="File browser example"
								multiple={this.state.sdMode}
								onChange={this.handleChange}
							/>
							<span className="file-custom">
								{this.state.fileNames.length > 1
									? this.state.fileNames.length +
									  " files selected"
									: this.state.fileNames}
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
								? "Building..."
								: "Build charts"
							: this.state.isLoading
							? "Adding..."
							: "Add average"}
					</button>
				</form>
			</div>
		);
	}
}

export default withFirebase(CalculationPage);
