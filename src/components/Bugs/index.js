import React from "react";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { withAuthorization } from "../Session";

import moment from "moment";
import { useLocalization } from "../Localization";

import "./index.scss";

const showModal = {
	show: {
		visibility: "visible",
		opacity: 1,
		pointerEvents: "auto"
	},
	hide: {
		visibility: "hidden",
		opacity: 0,
		pointerEvents: "none"
	}
};

class BugsPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			bugs: [],
			loading: false,
			title: "",
			about: "",
			showModal: showModal.hide
		};

		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		this.setState({ loading: true });
		this.props.firebase.bugs().on("value", snapshot => {
			const bugsObject = snapshot.val();

			if (bugsObject) {
				const bugsList = Object.keys(bugsObject).map(key => ({
					...bugsObject[key],
					uid: key
				}));

				this.setState({ bugs: bugsList, loading: false });
			}
		});
	}

	onChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	render() {
		const handleClose = () => {
			this.setState({ showModal: showModal.hide });

			const { title, about, bugs } = this.state;

			if (title !== "") {
				const dateTime = moment(new Date().toUTCString())
					.toDate()
					.getTime();
				const id = this.state.bugs.length;
				const newBug = {
					title,
					about,
					dateTime,
					id
				};

				this.setState({ bugs: [...bugs, newBug] });

				this.props.firebase.bugs().set([...bugs, newBug]);
			}
		};
		const handleShow = () => this.setState({ showModal: showModal.show });
		return (
			<div className="bugsBox">
				<h1>
					{this.props.strings.bugs + " "}
					<button
						className="newBugButton"
						onClick={() => handleShow()}
					>
						{this.props.strings.newBug}
					</button>
				</h1>
				{this.state.bugs.map(bug => (
					<div className="bug">
						<div className="bugHeader">
							<strong className="mr-auto">
								{bug.title} #{bug.id}
							</strong>
							<small>
								{Math.round(
									(moment(new Date().toUTCString())
										.toDate()
										.getTime() -
										bug.dateTime) /
										1000 /
										60
								)}{" "}
								{this.props.strings.minAgo}
							</small>
						</div>
						{bug.about !== "" && (
							<div className="bugContent">{bug.about}</div>
						)}
					</div>
				))}
				<div class="modal-window" style={this.state.showModal}>
					<div className="container">
						<button
							onClick={() =>
								this.setState({ showModal: showModal.hide })
							}
							title="Close" className="close"
						>
						</button>
						<h1 className="newBugTitle">New bug</h1>
						<form>
							<div>
								<input
									name="title"
									className="title"
									onChange={this.onChange}
									type="text"
									placeholder={this.props.strings.title}
								/>
							</div>
							<div>
								<textarea
									name="about"
									className="about"
									onChange={this.onChange}
									placeholder={
										this.props.strings.leaveComment
									}
								/>
							</div>
						</form>
						<div>
							<button className="submitBug" onClick={handleClose}>
								{this.props.strings.submit}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default compose(
	withFirebase,
	withAuthorization(authUser => !!authUser),
	useLocalization
)(BugsPage);
