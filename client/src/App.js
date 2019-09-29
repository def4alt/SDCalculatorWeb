// /client/App.js
import React, { Component } from 'react';
import Calculation from './Pages/Calculation';

class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
            statisticsModels: null
        };    
	}    
	myCallback = (dataFromChild) => {
		this.setState({ statisticsModels: dataFromChild });
		setTimeout(() => {
			console.log(dataFromChild);
		}, 100)
    }

	render() {
		return (
			<div>
				<Calculation callback={this.myCallback}/>
			</div>
		);
	}
}

export default App;
