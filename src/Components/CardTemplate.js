import React from 'react';

import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';
import '../../node_modules/react-vis/dist/style.css';
import './CardTemplate.css'

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import domtoimage from 'dom-to-image';
import printJS from 'print-js';

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
    );
};



class CardTemplate extends React.Component 
{
    constructor (props)
    {
        super(props);

        this.state = {
            model: props.model,
            width: props.width,
            height: props.height,
            editMode: props.editMode,
            starred: false,
            showChart: true
        }
    }
    componentDidUpdate(prevProps)
    {
        if (this.props.editMode !== prevProps.editMode)
        {
           this.setState({ editMode: this.props.editMode });
        }
    }

    render()
    {
        let model = this.state.model;
        var data = [...Array(model.Average.length)].map((_, i) => new Object({ x: i, y: model.Average[i] }))
        var chart = <div id="canvas"><XYPlot 
            width={this.state.width < 800 ? 200: this.state.width / 6} 
            height={this.state.height < 600 ? 200: this.state.height / 4}>
            <YAxis />
            <LineSeries
                data={data}
                style={{
                    strokeLinejoin: 'round',
                    strokeWidth: 4
                }}
                color="#d63031"
            />
            {Line(model.Average[0] + 3 * model.StandardDeviation, "#e84393", model.Average.length)}
            {Line(model.Average[0] + 2 * model.StandardDeviation, "#00cec9", model.Average.length)}
            {Line(model.Average[0] + model.StandardDeviation, "#ff7675", model.Average.length)}
            {Line(model.Average[0], "#6c5ce7", model.Average.length)}
            {Line(model.Average[0] - model.StandardDeviation, "#ff7675", model.Average.length)}
            {Line(model.Average[0] - 2 * model.StandardDeviation, "#00cec9", model.Average.length)}
            {Line(model.Average[0] - 3 * model.StandardDeviation, "#e84393", model.Average.length)}

        </XYPlot></div>;


    return (
        <div>
            <Card className="text-center card" id="card" style={{
                borderColor: this.state.starred ? "#fdcb6e" : 'transparent',
                width: this.state.width < 800 ? 300: this.state.width / 6 + 100,
                display: this.state.showChart ? "block" : "none"
                }} key={model.TestName + model.SampleType}>
                <Card.Header>
                    {model.TestName + " Lvl" + model.SampleType}
                </Card.Header>
                <Card.Body>

                    <div className="center" >
                            {chart}
                    </div>
                    {this.state.editMode && 
                    <>
                        <Button variant='outline-dark'
                            style={{margin: 3}} onClick={() => {this.setState({showChart: false})}}>Delete</Button>
                        <Button variant='outline-warning' 
                            style={{margin: 3}} onClick={() => {this.setState({starred: !this.state.starred})}}>Star</Button>
                        <Button variant='outline-success' 
                            style={{margin: 3}} onClick={() =>
                                {
                                    this.setState({editMode: false});
                                    new Promise(res => this.forceUpdate(res)).then(
                                    domtoimage.toPng(document.getElementById('card')).then(pngUrl => 
                                        printJS({printable: pngUrl, type:'image'})
                                        ).then(() => this.setState({editMode: true}))
                                    )
                                } 
                            }>Print</Button>
                    </>
                    }
                </Card.Body>
            </Card>
        </div>
    );
    }
}

export default CardTemplate;