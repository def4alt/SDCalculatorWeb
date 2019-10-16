import React from 'react';

import '../css/cards.css';

import Card from './CardTemplate';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class CardsHolder extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			statisticsModels: props.statisticsModels,
			showChart: true,
			width: 0,
			height: 0,
			editMode: false
		};

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	componentDidUpdate(prevProps) {
		if (this.props.statisticsModels !== prevProps.statisticsModels) {
			this.setState({ statisticsModels: this.props.statisticsModels });
		}

        if (this.props.editMode !== prevProps.editMode)
        {
            this.setState({ editMode: this.props.editMode })
        }
	}

	render() {
		var cards = Array.from(this.state.statisticsModels).map(model => {
			return <Card model={model} width={this.state.width} height={this.state.height} editMode={this.state.editMode}/>
		})

		return (

			<div className="border-bottom">
			<Row>
				<Col sm={10}>
					<Button 
						variant="link"
						onClick={() => this.setState({showChart: !this.state.showChart})}>
							Toggle charts
					</Button>
				</Col>
				<Col sm="auto">
					<Button 
						style={{visibility: this.state.showChart ? "visible" : "hidden"}} 
						variant="link" onClick={() => this.setState({ editMode: !this.state.editMode })}>
							Toggle Edit
					</Button>
				</Col>
			</Row>
			<div className="cardsHolder">
				{this.state.showChart && cards}
			</div>
			</div>
		)
	}
}

export default CardsHolder;