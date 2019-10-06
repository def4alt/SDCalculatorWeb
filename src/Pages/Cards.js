import React from 'react';

import '../../node_modules/react-vis/dist/style.css';
import '../css/cards.css';
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';

var Line = (value, color, repeat) => {
	return (
		<LineSeries
			data={[...Array(repeat == 1 ? 2 : repeat)]
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
			statisticsModels: props.statisticsModels
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.statisticsModels !== prevProps.statisticsModels) {
			this.setState({ statisticsModels: this.props.statisticsModels });
		}
	}

	render() {

		return (
			<div class="cardsHolder">
				{Array.from(this.state.statisticsModels).map(model => {
					var data = [...Array(model.Average.length)].map((_, i) => new Object({ x: i, y: model.Average[i] }))

					return (
						<div class="card">

							<XYPlot height={300} width={300}>
								<HorizontalGridLines style={{ stroke: '#B7E9ED' }} />
								<VerticalGridLines style={{ stroke: '#B7E9ED' }} />
								<XAxis
									title={model.TestName + " Lvl" + model.SampleType}
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

							</XYPlot>
						</div>
					);
				})}
			</div>
		)
	}
}

export default Cards;