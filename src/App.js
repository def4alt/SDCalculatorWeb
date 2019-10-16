// /client/App.js
import React, { Component, Suspense } from 'react';
import Calculation from './Components/Calculation';
import CardsHolder from './Components/CardsHolder';

const LazyCards = React.lazy(() => import('./Components/CardsHolder'));

class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
			statisticsModels: []
        };
	}
	myCallback = (dataFromChild) => {
		this.setState({ statisticsModels: dataFromChild });

		if (dataFromChild.length > 0) {
			this.setState({ showCharts: true });
		}
    }

	render() {

		return (
			<div>
				<br/>
				<br/>
				<br/>

				<div className="d-flex justify-content-center text-center">
					<Calculation callback={this.myCallback} statisticsModels={this.state.statisticsModels}/>
				</div>

				<br/>
				<br/>
				<br/>
				<br/>
				<br/>
				
				{this.state.statisticsModels.length > 0 && <CardsHolder statisticsModels={this.state.statisticsModels}/>}
			</div>
		);
	}
}

export default App;
