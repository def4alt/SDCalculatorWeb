// /client/App.js
import React, { Component } from 'react';
import Calculation from './Pages/Calculation';
import Charts from './Pages/Charts';

class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
            statisticsModels: []
        };
	}
	myCallback = (dataFromChild) => {
		this.setState({ statisticsModels: dataFromChild });
    }

	render() {
		return (
			<div>
				<Calculation callback={this.myCallback} statisticsModels={this.state.statisticsModels}/>
				{this.state.statisticsModels.length > 0 &&
					 <Charts statisticsModels={this.state.statisticsModels}/>}


			</div>
		);
	}
}

export default App;
