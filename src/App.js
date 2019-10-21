// /client/App.js
import React, { Component, Suspense } from 'react';
import Calculation from './Components/Calculation';

import './App.css'

const LazyCards = React.lazy(() => import("./Components/CardsHolder"));

class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
			statisticsModels: [],
			showCharts: true
        };
	}
	myCallback = (dataFromChild) => {
		this.setState({ statisticsModels: dataFromChild });

		if (dataFromChild.length > 0) {
			this.setState({ showCharts: false });
		}
    }

	render() {

		return (
			<div>
				<div className="center" style={{margin: 100}}>
					<Calculation callback={this.myCallback} statisticsModels={this.state.statisticsModels}/>
				</div>
				
				{this.state.statisticsModels.length > 0 && 
				<Suspense fallback={
					<div className="loadingCircle"></div>

			  	}>
					<LazyCards className="center" statisticsModels={this.state.statisticsModels}/>
				</Suspense>}
			</div>
		);
	}
}

export default App;
