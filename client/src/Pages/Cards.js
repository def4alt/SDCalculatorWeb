import React from 'react';

class Cards extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            statisticsModels: props.statisticsModels
        };
    }

    render()
    {
        return(
            <div>
                <ul>
                    {Array.from(this.state.statisticsModels).map(model => {
                        return (
                        <li key={model.TestName + model.SampleType}> 
                            <br/>
                            <label>Average: {model.Average} </label>
                            <br/>
                            <label>StandardDeviation: {model.StandardDeviation} </label>
                            <br/>
                            <label>TestName: {model.TestName} </label>
                            <br/>
                            <label>SampleType: {model.SampleType == 1 ? 'Lvl1' : 'Lvl2'} </label>
                            <br/>
                        </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
}

export default Cards;