import React from "react";

import { XYPlot, LineSeries, XAxis, YAxis } from "react-vis";
import "../../../node_modules/react-vis/dist/style.css";
import "./CardsTemplate.css";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import domtoimage from "dom-to-image";
import printJS from "print-js";

var Line = (value, color, repeat) => {
	return (
		<LineSeries
			data={[...Array(repeat === 1 ? 2 : repeat)].map(
				(_, i) => new Object({ x: i, y: value })
			)}
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
			showChart: true
		};
	}
	componentDidUpdate(prevProps) {
		if (this.props.editMode !== prevProps.editMode) {
			this.setState({ editMode: this.props.editMode });
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
		var data = [...Array(model.Average.length)].map(
			(_, i) => new Object({ x: i, y: model.Average[i] })
		);
		var chart = (
			<div id="canvas">
				<XYPlot
					width={
						this.state.width < 800
							? 100 + 100 * model.Average.length
							: this.state.width / 5 + 100 * model.Average.length
					}
					height={
						this.state.height < 600 ? 200 : this.state.height / 4
					}
				>
					<YAxis tickValues={yValues} />
					<XAxis
						left={25}
						hideLine
						tickValues={[...Array(model.Average.length).keys()]}
						tickFormat={i => model.Date[i]}
					/>
					<LineSeries
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
			<div>
				<Card
					className="text-center card"
					id="card"
					style={{
						borderColor: this.state.starred
							? "#fdcb6e"
							: "transparent",
						width:
							this.state.width < 800
								? 200 + 100 * model.Average.length
								: this.state.width / 6 +
								  100 * model.Average.length,
						display: this.state.showChart ? "block" : "none"
					}}
					key={model.TestName + model.SampleType}
				>
					<Card.Header>
						{model.TestName + " Lvl" + model.SampleType}
					</Card.Header>
					<Card.Body>
						<div className="center">{chart}</div>
						{this.state.editMode && (
							<>
								<Button
									variant="outline-warning"
									style={{ margin: 3 }}
									onClick={() => {
										this.setState({
											starred: !this.state.starred
										});
									}}
								>
									Star
								</Button>
								<Button
									variant="outline-info"
									style={{ margin: 3 }}
									onClick={() => {
										this.setState({ editMode: false });
										new Promise(res =>
											this.forceUpdate(res)
										).then(
											domtoimage
												.toPng(
													document.getElementById(
														"card"
													)
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
									Print
								</Button>
								<Button
									variant="outline-success"
									style={{ margin: 3 }}
									onClick={() => {
										this.setState({ editMode: false });
                    this.forceUpdate();
                    
										const card = document.getElementById(
											"card"
                    );
                    
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
									Save
								</Button>

								<Button
									variant="outline-dark"
									style={{ margin: 3 }}
									onClick={() => {
										this.setState({ showChart: false });
									}}
								>
									Delete
								</Button>
							</>
						)}
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default CardTemplate;
