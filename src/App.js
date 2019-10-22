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
			showCharts: true,
			date: '',
			lot: ''
        };
	}
	myCallback = (dataFromChild) => {
		this.setState({ statisticsModels: dataFromChild.statisticsModels });

		if (dataFromChild.statisticsModels.length > 0) {
			this.setState({ showCharts: false });
		}
		this.setState({date: dataFromChild.date});

		this.setState({lot: dataFromChild.lot });
    }

	render() {

		return (
			<div>
				<div className="center" style={{marginTop: 80}}>
					<Calculation callback={this.myCallback} statisticsModels={this.state.statisticsModels}/>
				</div>

				
				{this.state.statisticsModels.length > 0 && 
				<>
				<div className="detailsBox">
					<p className="header">Details</p>
					<p>Date: {this.state.date}</p>
					<p>Lot: {this.state.lot}</p>
				</div>
				<Suspense fallback={
					<div className="loadingCircle"></div>
			  	}>
					<LazyCards className="center" statisticsModels={this.state.statisticsModels}/>
				</Suspense>
				</>}
			</div>
		);
	}
}

export default App;
