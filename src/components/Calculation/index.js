import React, { Component } from "react";

import Read from "./reader";
import GetStatistics from "./statistics";

import { withFirebase } from "../Firebase";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";

import "./index.css";

import { useTheme } from "../Theme";

import { compose } from "recompose";

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
									.filter(key => key !== "theme")
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
		var statisticsModels = GetStatistics(parsedRows);
		let globalStatisticsModels = Array.from(
			this.state.globalStatisticsModels
		);

		if (statisticsModels === undefined) {
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

		if (this.state.lot === "") {
			this.setState({ lot: "0" });
		}

		this.props.callback({
			statisticsModels: globalStatisticsModels,
			lot: this.state.lot
		});

		if (this.props.firebase.auth.currentUser) {
			const backups = this.props.firebase.backup(
				this.props.firebase.auth.currentUser.uid
			);

			var backupsObject;
			backups.on("value", snapshot => (backupsObject = snapshot.val()));

			if (backupsObject)
				backups.set({
					...backupsObject,
					[this.state.lot]: {
						models: globalStatisticsModels
					}
				});
		}

		this.setState({ error: "", isLoading: false });
	}

	handleChange(event) {
		this.setState({ files: event.target.files });
	}

	handleLotChange(event) {
		this.setState({ lot: event.target.value });
	}

	handleCheckChange(event) {
		this.setState({ sdMode: event.target.checked });
	}

	handleSubmit(event) {
		if (this.state.files.length !== 0 && !this.state.lotSelected) {
			this.setState({ isLoading: true });
			this.calculate(this.state.files);
		}
		event.preventDefault();
		this.setState({ lotSelected: false });
	}

	render() {
		return (
			<div
				className="center"
				style={{ color: this.props.theme.theme.color }}
			>
				<Form onSubmit={this.handleSubmit}>
					{this.state.error !== "" && (
						<Alert variant={this.props.theme.theme.variant}>
							{this.state.error}
						</Alert>
					)}
					<Dropdown>
						<Form.Group>
							<Form.Label>Lot</Form.Label>
							<Dropdown.Toggle variant="link">
								<Form.Control
									type="number"
									placeholder="e.g. 1214"
									value={this.state.lot}
									onChange={this.handleLotChange}
								/>
							</Dropdown.Toggle>
							<Dropdown.Menu alignRight={true}>
								{this.state.backups.map(backup => (
									<Dropdown.Item
										as="button"
										eventKey={backup.lot}
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
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Form.Group>
					</Dropdown>
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
							<span
								className="file-custom"
							>
								{this.state.files.length > 1 
										? this.state.files.length +
										  " files selected"
										: this.state.files.length === 0 ? "" : this.state.files[0].name}
							</span>
							<div></div>
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
				</Form>
			</div>
		);
	}
}

export default compose(
	withFirebase,
	useTheme
)(CalculationPage);
