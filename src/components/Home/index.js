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
		this.setState({ date: dataFromChild.statisticsModels[0].Date });

		this.setState({ lot: dataFromChild.lot });
	};

	componentDidMount() {
		this.listener = this.props.firebase.auth.onAuthStateChanged(authUser =>
			authUser
				? this.props.firebase
						.backup(this.props.firebase.auth.currentUser.uid)
						.on("value", snapshot => {
							if (snapshot.val().statisticsModels)
								this.setState({
									statisticsModels: snapshot.val().backup,
									lot: snapshot.val().lot,
									date: snapshot.val().backup[0].Date
								});
						})
				: this.setState({
						statisticsModels: []
				  })
		);
		window.addEventListener("scroll", this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
		this.listener();
		this.props.firebase.backup().off();
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
			<div>
				<div>
					<div className="bugButton">
						<Button variant="link" onClick={() => this.props.history.push(ROUTES.BUGS)}>Found any bug?</Button>
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
							<Card.Header>Details</Card.Header>
							<Card.Body>
								<Card.Text>Date: {this.state.date}</Card.Text>
								<hr />
								<Card.Text>Lot: {this.state.lot}</Card.Text>
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
	withAuthorization(authUser => true),
	withRouter
)(HomePage);
