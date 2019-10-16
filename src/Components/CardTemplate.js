import React from 'react';

import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';
import '../../node_modules/react-vis/dist/style.css';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

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

class CardTemplate extends React.Component 
{
    constructor (props)
    {
        super(props);

        this.state = {
            model: props.model,
            width: props.width,
            height: props.height,
            editMode: false,
            starred: false
        }
    }

    render()
    {
        let model = this.state.model;
        var data = [...Array(model.Average.length)].map((_, i) => new Object({ x: i, y: model.Average[i] }))
        var chart = <XYPlot 
            width={this.state.width < 800 ? 200: this.state.width / 6} 
            height={this.state.height < 600 ? 200: this.state.height / 4}>
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
            <Card className="text-center" style={{
                width: this.state.width < 800 ? 300: this.state.width / 6 + 100,
                display: "flex"}} key={model.TestName + model.SampleType}>
                <Card.Header>
                    {model.TestName + " Lvl" + model.SampleType}
                </Card.Header>
                <Card.Body>

                    <Button variant={this.state.starred ? "outline-warning" : "outline-light"} onClick={() => {
                        this.setState({ showChart: true, chart: chart });
                    }}>
                            {chart}
                    </Button>
                    <Form.Check aria-label="option 1" class="checkBox"/>
                </Card.Body>
            </Card>
        </div>
    );
    }
}

export default CardTemplate;