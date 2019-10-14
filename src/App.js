// /client/App.js
import React, { Component, Suspense } from 'react';
import Calculation from './Pages/Calculation';
import Cards from './Pages/Cards';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const LazyCards = React.lazy(() => import('./Pages/Cards'));

class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
			statisticsModels: [],
			showCharts: false
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
				
				<div className="border-bottom">
					<Row>
						<Col sm={10}>
							<Button 
								variant="link" 
								style={{visibility: this.state.statisticsModels.length > 0 ? "visible" : "hidden"}}
								onClick={() => this.setState({showCharts: !this.state.showCharts})}>
									Toggle charts
							</Button>
						</Col>
						<Col sm="auto">
							{/*<Button 
								style={{visibility: this.state.showCharts ? "visible" : "hidden"}} 
							variant="link">Edit</Button>*/}
							</Col>
					</Row>
				</div>
				{this.state.showCharts && 
					<Suspense fallback={<div>Loading...</div>}>
						<LazyCards statisticsModels={this.state.statisticsModels}/>
					</Suspense>
				}
			</div>
		);
	}
}

export default App;
