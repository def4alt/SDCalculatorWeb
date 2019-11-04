import React, { Component, Suspense } from "react";
import { withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";

import Calculation from "../Calculation";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import "./index.css";

import { useTheme } from "../Theme";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { useLocalization } from "../Localization";

const LazyCards = React.lazy(() => import("../Cards"));

class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			statisticsModels: [],
			showCharts: true,
			date: "",
			lot: "",
			displayCalc: true
		};

		this.handleScroll = this.handleScroll.bind(this);
	}
	myCallback = dataFromChild => {
		this.setState({ statisticsModels: dataFromChild.statisticsModels });

		if (dataFromChild.statisticsModels.length > 0) {
			this.setState({ showCharts: false });
		}

		this.setState({ date: dataFromChild.statisticsModels[0].Date[0] });

		this.setState({ lot: dataFromChild.lot });
	};

	componentDidMount() {
		window.addEventListener("scroll", this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
	}

	handleScroll() {
		let scrollTop = window.scrollY;
		if (
			scrollTop > window.outerHeight / 2 &&
			this.state.displayCalc &&
			this.state.statisticsModels.length > 0
		) {
			window.scrollTo(0, 0);
			this.setState({ displayCalc: false });
		}
	}

	render() {
		return (
			<div
				style={{
					backgroundColor: this.props.theme.theme.backgroundColor
				}}
			>
				<div>
					<div className="bugButton">
						<Button
							variant="link"
							onClick={() => this.props.history.push(ROUTES.BUGS)}
						>
							{this.props.strings.foundBug}
						</Button>
					</div>
					<div
						className="calculation"
						hidden={!this.state.displayCalc}
					>
						<Calculation
							callback={this.myCallback}
							statisticsModels={this.state.statisticsModels}
						/>
					</div>
					<div className="arrowBtn" hidden={this.state.displayCalc}>
						<Button
							style={{
								height: 25,
								backgroundColor: "transparent",
								borderColor: "transparent"
							}}
							variant={this.props.theme.theme.variantOutline}
							onClick={() => this.setState({ displayCalc: true })}
						>
							<i className="arrow up"></i>
						</Button>
					</div>
				</div>

				{this.state.statisticsModels.length > 0 && (
					<>
						<Card
							style={{
								width: "18rem",
								backgroundColor: this.props.theme.theme
									.backgroundColor,
								color: this.props.theme.theme.color,
								borderColor: this.props.theme.theme.lightBack
							}}
						>
							<Card.Header>{this.props.strings.details}</Card.Header>
							<Card.Body>
								<Card.Text>
									{this.props.strings.date}: {this.state.date}
								</Card.Text>
								<hr />
								<Card.Text>
									{this.props.strings.lot}: {this.state.lot}
								</Card.Text>
							</Card.Body>
						</Card>
						<Card
							style={{
								width: "50rem",
								backgroundColor: this.props.theme.theme
									.backgroundColor,
								color: this.props.theme.theme.color,
								borderColor: this.props.theme.theme.lightBack
							}}
						>
							<Card.Header>Abbreviations</Card.Header>
							<Card.Body>
								<Card.Title>13S</Card.Title>
								<Card.Text>{this.props.strings.abr13S}</Card.Text>
								<hr />
								<Card.Title>22S</Card.Title>
								<Card.Text>{this.props.strings.abr22S}</Card.Text>
								<hr />
								<Card.Title>R4S</Card.Title>
								<Card.Text>{this.props.strings.abrR4S}</Card.Text>
								<hr />
								<Card.Title>41S</Card.Title>
								<Card.Text>{this.props.strings.abr41S}</Card.Text>
								<hr />
								<Card.Title>8X</Card.Title>
								<Card.Text>{this.props.strings.abr8X}</Card.Text>
							</Card.Body>
						</Card>
						<Suspense
							fallback={<div className="loadingCircle"></div>}
						>
							<LazyCards
								className="center"
								statisticsModels={this.state.statisticsModels}
							/>
						</Suspense>
					</>
				)}
			</div>
		);
	}
}

export default compose(
	useTheme,
	withAuthorization(authUser => (authUser !== null ? true : true)),
	withRouter,
	useLocalization
)(HomePage);
