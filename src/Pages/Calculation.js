import React, { Component } from 'react';
import Read from '../js/reader';
import GetStatistics from '../js/statistics';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


class Calculation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [], sdMode: true, globalStatisticsModels: [], isLoading: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.statisticsModels !== prevProps.statisticsModels) {
            this.setState({ globalStatisticsModels: this.props.statisticsModels });
        }
    }

    calculate(files) {

        return new Promise(async res => {
            var parsedRows = [];
            for (const file of files) {
                await Read(file).then(parsed => {
                    for (const model of parsed) {
                        parsedRows.push(model);
                    }
                });
            }
            var statisticsModels = GetStatistics(parsedRows, []);
            let globalStatisticsModels = Array.from(this.state.globalStatisticsModels);

            if (statisticsModels === undefined)
            {
                res(null);
                return;
            }

            if (!this.state.sdMode) {

                for (let i = 0; i < statisticsModels.length; i++) {
                    const model = statisticsModels[i];

                    var globalModel = globalStatisticsModels.filter(t => t.TestName === model.TestName
                        && t.SampleType === model.SampleType)[0];

                    if (globalModel !== undefined)
                        globalModel.Average.push(model.Average);
                }
            }
            else {
                globalStatisticsModels = statisticsModels;
            }
            this.props.callback(globalStatisticsModels);
            res(globalStatisticsModels);
        });
    }

    handleChange(event) {
        this.setState({ files: event.target.files });
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
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formCheckBox">
                        <Form.Check type="checkbox" checked={this.state.sdMode} onChange={this.handleCheckChange} label="SDMode" />
                    </Form.Group>
                    <Form.Group controlId="formBasicFileInput">
                        <Form.Label>Select files:</Form.Label>
                        <Form.Control className="form-control-file" type="file" multiple onChange={this.handleChange} />
                    </Form.Group>
                    <Button
                        variant="primary"
                        disabled={this.state.isLoading}
                        onClick={!this.state.isLoading ? this.handleSubmit : null}
                    >
                        {this.state.isLoading ? 'Calculating...' : 'Calculate'}
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Calculation;
