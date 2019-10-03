import React from 'react';

import '../../node_modules/react-vis/dist/style.css';
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';

var Line = (value, color) => {
	return (
		<LineSeries
			data={[
				{ x: 1, y: value },
				{ x: 2, y: value },
				{ x: 3, y: value }]}
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

	render() {

		return (
			<div>
				<ul>
					{Array.from(this.state.statisticsModels).map(model => {
						var data = []
						for (let index = 0; index < Array.from(model.Average).length; index++) {
							data.push({ x: index + 1, y: Array.from(model.Average)[index] })

						}


						return (
							<li key={model.TestName + model.SampleType}>

								<XYPlot height={300} width={300}>
									<HorizontalGridLines style={{ stroke: '#B7E9ED' }} />
									<VerticalGridLines style={{ stroke: '#B7E9ED' }} />
									<XAxis
										title={model.TestName + " Lvl" + model.SampleType}
										style={{
											line: { stroke: '#ADDDE1' },
											ticks: { stroke: '#ADDDE1' },
											text: { stroke: 'none', fill: '#6b6b76', fontWeight: 600 }
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
									{Line(model.Average[0] + 3 * model.StandardDeviation, "#ffac33")}
									{Line(model.Average[0] + 2 * model.StandardDeviation, "#00bcd4")}
									{Line(model.Average[0] + model.StandardDeviation, "#8bc34a")}
									{Line(model.Average[0], "#8561c5")}
									{Line(model.Average[0] - model.StandardDeviation, "#8bc34a")}
									{Line(model.Average[0] - 2 * model.StandardDeviation, "#00bcd4")}
									{Line(model.Average[0] - 3 * model.StandardDeviation, "#ffac33")}

								</XYPlot>
							</li>
						);
					})}
				</ul>
			</div>
		)
	}
}

export default Cards;