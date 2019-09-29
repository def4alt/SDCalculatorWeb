import React, {Component} from 'react';
import axios from 'axios';
import Read from '../js/reader';
import GetStatistics from '../js/statistics';


class Calculation extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {files: []};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    calculate(files)
    {
        var millisecondsToWait = 100;
        var statisticsModels = [];
        var parsedRows = [];
    
        Array.from(files).forEach(file => {
            var parsed = Read(file);
    
            setTimeout(function() {
                parsed.forEach(testModel => {
                    parsedRows.push(testModel);
                })
            }, millisecondsToWait);
        });
    
        setTimeout(() => {
            statisticsModels = GetStatistics(parsedRows, []);
    
            console.log(statisticsModels);
            this.props.callback(statisticsModels);
        }, millisecondsToWait);
    }

    handleChange(event)
    {
        this.setState({files: event.target.files});
    }

    handleSubmit(event)
    {
        this.calculate(this.state.files);
        
        event.preventDefault();
    }

    render()
    {
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Select files:
                        <input type="file" accept=".xlsx, .xls" multiple onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Calculate"/>
                </form>
            </div>
        );
    }
}

export default Calculation;