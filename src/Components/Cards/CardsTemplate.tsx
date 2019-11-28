import React from "react";

//@ts-ignore
import { XYPlot, LineMarkSeries, LineSeries, XAxis, YAxis } from "react-vis";
import "../../../node_modules/react-vis/dist/style.css";
import "./CardsTemplate.scss";

import { useLocalization, stringsType } from "../Localization";
import { StatisticsModel } from "../Calculation/statistics";

var Line = (value: number, color: string, repeat: number) => {
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

type CardTemplateProps = {
	model: StatisticsModel;
	editMode: boolean;
	cardWidth: number;
	showStarredCharts: boolean;
	strings: stringsType;
};

type CardTemplateState = {
	model: StatisticsModel;
	editMode: boolean;
	starred: boolean;
	width: number;
	showChart: boolean;
	showStarredCharts: boolean;
};

class CardTemplate extends React.Component<
	CardTemplateProps,
	CardTemplateState
> {
	constructor(props: CardTemplateProps) {
		super(props);

		this.state = {
			model: props.model,
			editMode: props.editMode,
			starred: false,
			showChart: true,
			showStarredCharts: props.showStarredCharts,
			width: props.cardWidth
		};
	}

	componentDidUpdate(prevProps: CardTemplateProps) {
		if (this.props.editMode !== prevProps.editMode) {
			this.setState({ editMode: this.props.editMode });
		}
		if (this.props.model !== prevProps.model) {
			this.setState({ model: this.props.model });
		}
		if (this.props.showStarredCharts !== prevProps.showStarredCharts) {
			this.setState({ showStarredCharts: this.props.showStarredCharts });
		}
		if (this.props.cardWidth !== prevProps.cardWidth) {
			this.setState({ width: this.props.cardWidth });
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
			<div id="canvas">
				<XYPlot
					margin={{ left: 90, right: 30, bottom: 50 }}
					width={
						250 + 100 * model.Average.length >
							window.innerWidth - 50 && window.innerWidth !== 0
							? window.innerWidth - 80
							: 250 + 100 * model.Average.length
					}
					height={250}
				>
					<YAxis
						tickValues={yValues}
						style={{ display: "inline-flex" }}
						tickFormat={(v: number, i: number) =>
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
							},
							ticks: {
								stroke: "none"
							}
						}}
						top={220}
						tickFormat={(i: number) => this.state.model.Warning[i]}
					/>
					<XAxis
						hideLine
						tickValues={[...Array(model.Average.length).keys()]}
						tickFormat={(i: number) => model.Date[i]}
						style={{
							ticks: {
								stroke: "none"
							}
						}}
						tickLabelAngle={-20}
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
								.length > 1
						? "#c62828"
						: ""
				}}
				className="text-center card"
				id="card"
				key={model.TestName + model.SampleType}
			>
				<h3>{model.TestName + " Lvl" + model.SampleType}</h3>
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
