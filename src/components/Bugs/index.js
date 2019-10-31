import React from "react";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { withAuthentication } from "../Session";

import Toast from "react-bootstrap/Toast";

class BugsPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			bugs: [],
			loading: false
		};
	}

	componentDidMount() {
		this.setState({ loading: true });
		this.props.firebase.bugs().on("value", snapshot => {
			const bugsObject = snapshot.val();

			const bugsList = Object.keys(bugsObject).map(key => ({
				...bugsObject[key],
				uid: key
			}));

			this.setState({ bugs: bugsList, loading: false });
		});
    }
    
    render() {
        return(
            <div>
                {/*this.state.bugs.map(bug => {
                    <Toast>
                        <Toast.Header>
                            <strong className="mr-auto">{bug.name}</strong>
                            <small>{Math.round(((new Date() - bug.date) / 1000) / 60)} minutes ago</small>
                        </Toast.Header>
                        <Toast.Body>
                            {bug.about}
                        </Toast.Body>
                    </Toast>
                })*/}
            </div>
        )
    }
}

export default compose(
	withFirebase,
	withAuthentication
)(BugsPage);
