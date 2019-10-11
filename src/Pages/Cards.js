import React from 'react';

import '../../node_modules/react-vis/dist/style.css';
import '../css/cards.css';
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FlexibleXYPlot, makeVisFlexible } from 'react-vis/dist/make-vis-flexible';

var Line = (value, color, repeat) => {
	return (
		<LineSeries
			data={[...Array(repeat === 1 ? 2 : repeat)]
				.map((_, i) => new Object({ x: i, y: value }))}
			style={{
				strokeLinejoin: 'round',
				strokeWidth: 2
			}}
			strokeDasharray="6, 10"
			color={color}
		/>
	)
}

class Cards extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			statisticsModels: props.statisticsModels,
			showChart: false,
			width: 0,
			height: 0
		};
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	renderChart(model, data) {
		return (
			<>


			</>
		);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	componentDidUpdate(prevProps) {
		if (this.props.statisticsModels !== prevProps.statisticsModels) {
			this.setState({ statisticsModels: this.props.statisticsModels });
		}
	}

	render() {

		const handleClose = () => this.setState({ showChart: false });

		return (
			<div className="cardsHolder">
				{Array.from(this.state.statisticsModels).map(model => {
					var data = [...Array(model.Average.length)].map((_, i) => new Object({ x: i, y: model.Average[i] }))
					var chart = <XYPlot 
						width={this.state.width < 800 ? 300: this.state.width / 5} 
						height={this.state.width < 600 ? 300: this.state.height / 4}>
						<HorizontalGridLines style={{ stroke: '#B7E9ED' }} />
						<VerticalGridLines style={{ stroke: '#B7E9ED' }} />
						<XAxis
							style={{
								line: { stroke: '#ADDDE1' },
								ticks: { stroke: '#ADDDE1' },
								text: { stroke: 'none', fill: '#6b6b76' },
								title: { fontSize: "15px" }
							}}
						/>
						<YAxis />
						<LineSeries
							data={data}
							style={{
								strokeLinejoin: 'round',
								strokeWidth: 4
							}}
							color="#f44336"
						/>
						{Line(model.Average[0] + 3 * model.StandardDeviation, "#ffac33", model.Average.length)}
						{Line(model.Average[0] + 2 * model.StandardDeviation, "#00bcd4", model.Average.length)}
						{Line(model.Average[0] + model.StandardDeviation, "#8bc34a", model.Average.length)}
						{Line(model.Average[0], "#8561c5", model.Average.length)}
						{Line(model.Average[0] - model.StandardDeviation, "#8bc34a", model.Average.length)}
						{Line(model.Average[0] - 2 * model.StandardDeviation, "#00bcd4", model.Average.length)}
						{Line(model.Average[0] - 3 * model.StandardDeviation, "#ffac33", model.Average.length)}

					</XYPlot>;


					return (
						<div>
							<Card  className="text-center" key={model.TestName + model.SampleType}>
								<Card.Header>
									{model.TestName + " Lvl" + model.SampleType}
								</Card.Header>
								<Card.Body >

									<Button variant="outline-light" onClick={() => {
										this.setState({ showChart: true, chart: chart });
									}}>
											{chart}
									</Button>
								</Card.Body>
							</Card>
						</div>
					);
				})}


{/*
				<Modal show={this.state.showChart} animation="false" centered="true" onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Big Picture</Modal.Title>
					</Modal.Header>
					<Modal.Body style={{width: this.state.width - 200, height:this.state.height - 200}}>
							{this.state.chart}
					</Modal.Body>

				</Modal>
*/}
			</div>
		)
	}
}

export default Cards;