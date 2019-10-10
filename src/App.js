// /client/App.js
import React, { Component } from 'react';
import Calculation from './Pages/Calculation';
import Cards from './Pages/Cards';

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
					 <Cards statisticsModels={this.state.statisticsModels}/>}


			</div>
		);
	}
}

export default App;
