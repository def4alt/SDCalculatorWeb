import React, { Component } from 'react';
import Read from '../js/reader';
import GetStatistics from '../js/statistics';


class Calculation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [], sdMode: true, globalStatisticsModels: []
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

    async calculate(files) {

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
            return;

        if (!this.state.sdMode) {

            for (let i = 0; i < statisticsModels.length; i++) {
                const model = statisticsModels[i];

                var globalModel = globalStatisticsModels.filter(t => t.TestName == model.TestName 
                    && t.SampleType == model.SampleType)[0];
                
                if (globalModel != undefined)
                    globalModel.Average.push(model.Average);
            }
        }
        else {
            globalStatisticsModels = statisticsModels;
        }
        this.props.callback(globalStatisticsModels);
    }

    handleChange(event) {
        this.setState({ files: event.target.files });
    }

    handleCheckChange(event) {
        this.setState({ sdMode: event.target.checked });
    }

    handleSubmit(event) {
        this.calculate(this.state.files);
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="checkbox" defaultChecked={this.state.sdMode} onChange={this.handleCheckChange} name="SDMode" />
                        <label htmlFor="scales">SDMode</label>
                        <br />
                        <br />

                        Select files:
                        <br />
                        <input type="file" accept=".xlsx, .xls" multiple onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Calculate" />
                </form>
            </div>
        );
    }
}

export default Calculation;
