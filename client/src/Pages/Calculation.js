import React, {Component} from 'react';
import axios from 'axios';
import Read from '../js/reader';


function calculate(files)
{
    console.log(files);
    Array.from(files).forEach(file => {
        var parsed = Read(file);

        var millisecondsToWait = 100;
        setTimeout(function() {
            parsed.push('hello');
            parsed.forEach(object => {
                console.log(object);
            })
        }, millisecondsToWait);
    });
}

class Calculation extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {files: []};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event)
    {
        this.setState({files: event.target.files});
    }

    handleSubmit(event)
    {
        calculate(this.state.files);
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