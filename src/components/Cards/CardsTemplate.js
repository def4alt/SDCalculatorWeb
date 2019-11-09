import React from "react";

import { XYPlot, LineMarkSeries, LineSeries, XAxis, YAxis } from "react-vis";
import "../../../node_modules/react-vis/dist/style.css";
import "./CardsTemplate.scss";

import domtoimage from "dom-to-image";
import printJS from "print-js";
import { useLocalization } from "../Localization";

var Line = (value, color, repeat) => {
	return (
		<LineSeries
			data={[...Array(repeat === 1 ? 2 : repeat)].map((_, i) => ({
				x: i,
				y: value
			}))}
			style={{
				strokeLinejoin: "round",
				strokeWidth: 2
			}}
			strokeDasharray="6, 10"
			color={color}
		/>
	);
};

class CardTemplate extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			model: props.model,
			width: props.width,
			height: props.height,
			editMode: props.editMode,
			starred: false,
			showChart: true,
			showStarredCharts: props.showStarredCharts
		};
	}
	componentDidUpdate(prevProps) {
		if (this.props.editMode !== prevProps.editMode) {
			this.setState({ editMode: this.props.editMode });
		}
		if (this.props.model !== prevProps.model) {
			this.setState({ model: this.props.model });
		}
		if (this.props.width !== prevProps.width) {
			this.setState({ width: this.props.width });
		}
		if (this.props.height !== prevProps.height) {
			this.setState({ height: this.props.height });
		}
		if (this.props.showStarredCharts !== prevProps.showStarredCharts) {
			this.setState({ showStarredCharts: this.props.showStarredCharts });
		}
	}

	render() {
		let model = this.state.model;
		let yValues = [
			model.Average[0] + 3 * model.StandardDeviation,
			model.Average[0] + 2 * model.StandardDeviation,
			model.Average[0] + model.StandardDeviation,
			model.Average[0],
			model.Average[0] - model.StandardDeviation,
			model.Average[0] - 2 * model.StandardDeviation,
			model.Average[0] - 3 * model.StandardDeviation
		];
		let yLabels = ["3SD", "2SD", "SD", "M", "SD", "2SD", "3SD"];
		var data = [...Array(model.Average.length)].map((_, i) => ({
			x: i,
			y: model.Average[i]
		}));

		var chart = (
			<div
				id="canvas"
				style={{
					width:
						this.state.width < 800
							? 100 + 100 * model.Average.length
							: this.state.width / 5 + 100 * model.Average.length
				}}
			>
				<XYPlot
					margin={{ left: 70, right: 30, bottom: 50 }}
					width={
						this.state.width < 800
							? 100 + 100 * model.Average.length - 100
							: this.state.width / 5 +
							  100 * model.Average.length -
							  100
					}
					height={
						this.state.height < 600 ? 200 : this.state.height / 4
					}
				>
					<YAxis
						tickValues={yValues}
						style={{ display: "inline-flex" }}
						tickFormat={(v, i) =>
							Math.round(v * 100) / 100 + `, ${yLabels[i]}`
						}
					/>

					<XAxis
						hideLine
						orientation="bottom"
						tickValues={[...Array(model.Average.length).keys()]}
						style={{
							fontSize: 15,
							text: {
								stroke: "none",
								fill: "#c62828",
								fontWeight: 100
							}
						}}
						top={
							this.state.height < 600
								? 165
								: this.state.height / 4.8
						}
						tickFormat={i => this.state.model.Warning[i]}
					/>
					<XAxis
						hideLine
						tickValues={[...Array(model.Average.length).keys()]}
						tickFormat={i => model.Date[i]}
					/>

					<LineMarkSeries
						data={data}
						style={{
							strokeLinejoin: "round",
							strokeWidth: 4
						}}
						color="#d63031"
					/>
					{Line(
						model.Average[0] + 3 * model.StandardDeviation,
						"#e84393",
						model.Average.length
					)}
					{Line(
						model.Average[0] + 2 * model.StandardDeviation,
						"#00cec9",
						model.Average.length
					)}
					{Line(
						model.Average[0] + model.StandardDeviation,
						"#ff7675",
						model.Average.length
					)}
					{Line(model.Average[0], "#6c5ce7", model.Average.length)}
					{Line(
						model.Average[0] - model.StandardDeviation,
						"#ff7675",
						model.Average.length
					)}
					{Line(
						model.Average[0] - 2 * model.StandardDeviation,
						"#00cec9",
						model.Average.length
					)}
					{Line(
						model.Average[0] - 3 * model.StandardDeviation,
						"#e84393",
						model.Average.length
					)}
				</XYPlot>
			</div>
		);

		return (
			<div
				style={{
					display: this.state.showChart
						? this.state.starred
							? "block"
							: this.state.showStarredCharts
							? "none"
							: "block"
						: "none",
					borderColor: this.state.starred
						? "#fdcb6e"
						: this.state.model.Warning.filter(v => v !== " ")
								.length > 1 && "#c62828",
					width:
						this.state.width < 800
							? 200 + 100 * model.Average.length
							: this.state.width / 6 + 100 * model.Average.length
				}}
				className="text-center card"
				id="card"
				key={model.TestName + model.SampleType}
			>
				<h5>{model.TestName + " Lvl" + model.SampleType}</h5>
				<div className="cardContent">
					<div className="center">{chart}</div>
					{this.state.editMode && (
						<>
							<button
								className="starButton"
								onClick={() => {
									this.setState({
										starred: !this.state.starred
									});
								}}
							>
								{this.props.strings.star}
							</button>
							<button
								className="printButton"
								onClick={() => {
									this.setState({ editMode: false });
									new Promise(res =>
										this.forceUpdate(res)
									).then(
										domtoimage
											.toPng(
												document.querySelector(".card")
											)
											.then(pngUrl =>
												printJS({
													printable: pngUrl,
													type: "image"
												})
											)
											.then(() =>
												this.setState({
													editMode: true
												})
											)
									);
								}}
							>
								{this.props.strings.print}
							</button>
							<button
								className="saveButton"
								onClick={() => {
									this.setState({ editMode: false });
									this.forceUpdate();

									const card = document.querySelector(".card");

									domtoimage
										.toPng(card)
										.then(dataUrl => {
											var link = document.createElement(
												"a"
											);
											link.download =
												model.TestName +
												" Lvl" +
												model.SampleType +
												".png";
											link.href = dataUrl;
											link.click();
										})
										.then(
											this.setState({
												editMode: true
											})
										);
								}}
							>
								{this.props.strings.save}
							</button>

							<button
								className="deleteButton"
								onClick={() => {
									this.setState({ showChart: false });
								}}
							>
								{this.props.strings.delete}
							</button>
						</>
					)}
				</div>
			</div>
		);
	}
}

export default useLocalization(CardTemplate);
