import React, { Component } from 'react';

import Read from '../js/reader';
import GetStatistics from '../js/statistics';

import './Calculation.css';


class Calculation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [], 
            sdMode: true, 
            globalStatisticsModels: [], 
            isLoading: false,
            fileNames: [],
            lot: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLotChange = this.handleLotChange.bind(this);
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
                    {
                        globalModel.Average.push(model.Average);
                        globalModel.Date.push(model.Date);
                    }
                }
            }
            else {
                globalStatisticsModels = statisticsModels;
            }
        
            this.props.callback({statisticsModels: globalStatisticsModels, date: globalStatisticsModels[0].Date, lot: this.state.lot});
            res(globalStatisticsModels);
        });
    }

    handleChange(event) {
        this.setState({ files: event.target.files });
        this.setState({ fileNames: Array.from(event.target.files).map(file => file.name) })
    }

    handleLotChange(event) {
        
        if (Number.parseInt(event.target.value) !== NaN) 
        {
            this.setState({ lot: event.target.value });
        }
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
                <form onSubmit={this.handleSubmit}>
                    
                    <div style={{position: 'relative', marginBottom: 20}}>
                        <input type="text" value={this.state.lot} onChange={this.handleLotChange} className="lotInput" placeholder="Lot"/>
                        <span className="lotSpan"></span>
                    </div>
                    <div className="center">
                        <label style={{marginRight: 20}}>Add average</label>
                        <label class="switch">
                            <input type="checkbox" checked={this.state.sdMode} onChange={this.handleCheckChange}/>
                            <span class="slider round"></span>
                        </label>
                        <label style={{marginLeft: 20}}>Build charts</label>
                    </div>

                    <div className="inputForm">
                        <p>{this.state.sdMode ? 'Select files:' : 'Select file:'}</p>
                        <label className="file">
                            <input type="file" id="file" aria-label="File browser example" multiple={this.state.sdMode} onChange={this.handleChange}/>
                            <span className="file-custom">
                                {this.state.fileNames.length > 1 ? 
                                    this.state.fileNames.length + " files selected" : this.state.fileNames}
                            </span>
                        </label>
                    </div>
                    <button className="calcButton"
                        disabled={this.state.isLoading}
                        onClick={!this.state.isLoading ? this.handleSubmit : null}
                    >
                        {this.state.sdMode ? 
                            this.state.isLoading ? 'Building...' : 'Build charts' : 
                            this.state.isLoading ? 'Adding...' : 'Add average'}
                    </button>
                </form>
            </div>
        );
    }
}

export default Calculation;
