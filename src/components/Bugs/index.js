import React from "react";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { withAuthorization } from "../Session";

import Toast from "react-bootstrap/Toast";
import { useTheme } from "../Theme";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import moment from "moment";
import { useLocalization } from "../Localization";

class BugsPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			bugs: [],
			loading: false,
			title: "",
			about: ""
		};
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
			this.setState({ showModal: false });

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
		const handleShow = () => this.setState({ showModal: true });
		return (
			<div
				style={{
					color: this.props.theme.theme.color,
					paddingLeft: 10
				}}
			>
				<h1>
					{this.props.strings.bugs + " "}
					<Button
						variant={this.props.theme.theme.variantOutline}
						onClick={() => handleShow()}
					>
						{this.props.strings.newBug}
					</Button>
				</h1>
				{this.state.bugs.map(bug => (
					<Toast
						style={{
							backgroundColor: this.props.theme.theme.lightBack,
							borderColor: this.props.theme.theme.lightBack
						}}
					>
						<Toast.Header
							closeButton={false}
							style={{
								backgroundColor: this.props.theme.theme
									.lightBack,
								color: this.props.theme.theme.color
							}}
						>
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
						</Toast.Header>
						{bug.about !== "" && (
							<Toast.Body
								style={{
									backgroundColor: this.props.theme.theme
										.backgroundColor
								}}
							>
								{bug.about}
							</Toast.Body>
						)}
					</Toast>
				))}
				<Modal show={this.state.showModal} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>{this.props.strings.newBug}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group>
								<Form.Control
									name="title"
									onChange={this.onChange}
									type="text"
									placeholder={this.props.strings.title}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Control
									name="about"
									onChange={this.onChange}
									as="textarea"
									placeholder={this.props.strings.leaveComment}
								/>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleClose}>
							{this.props.strings.submit}
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export default compose(
	withFirebase,
	useTheme,
	withAuthorization(authUser => !!authUser),
	useLocalization
)(BugsPage);
