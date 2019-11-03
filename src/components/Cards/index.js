import React from "react";

import "./index.css";

import { useTheme } from "../Theme";

import Button from "react-bootstrap/Button";
import CardTemplate from "./CardsTemplate";

class CardsHolder extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			statisticsModels: props.statisticsModels,
			showStarredCharts: false,
			width: 0,
			height: 0,
			editMode: false
		};

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener("resize", this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	componentDidUpdate(prevProps) {
		if (this.props.statisticsModels !== prevProps.statisticsModels) {
			this.setState({ statisticsModels: this.props.statisticsModels });
		}
	}

	render() {
		var cards = Array.from(this.state.statisticsModels).map(model => {
			return (
				<CardTemplate
					key={model.TestName + model.SampleType}
					model={model}
					width={this.state.width}
					height={this.state.height}
					editMode={this.state.editMode}
					showStarredCharts={this.state.showStarredCharts}
				/>
			);
		});
		
		return (
			<div
				style={{
					color: this.props.theme.theme.color,
					backgroundColor: this.props.theme.theme.backgroundColor
				}}
			>
				<div className="border-bottom center">
					<Button
						variant="link"
						onClick={() =>
							this.setState({
								showStarredCharts: !this.state.showStarredCharts
							})
						}
					>
						Toggle starred charts
					</Button>
					<Button
						variant="link"
						onClick={() =>
							this.setState({ editMode: !this.state.editMode })
						}
					>
						Toggle Edit
					</Button>
				</div>
				<div className="cardsHolder center">{cards}</div>
			</div>
		);
	}
}

export default useTheme(CardsHolder);
