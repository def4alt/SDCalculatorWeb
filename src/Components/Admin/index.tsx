import React from "react";
import Firebase, { withFirebase } from "../Firebase";
import { stringsType, useLocalization } from "../Localization";
import { withAuthorization } from "../Session";

type AdminPageProps = {
	firebase: Firebase;
	strings: stringsType;
};

type AdminPageState = {
	loading: boolean;
	users: Array<{ username: string; email: string; uid: string }>;
};

class AdminPage extends React.Component<AdminPageProps, AdminPageState> {
	constructor(props: AdminPageProps) {
		super(props);

		this.state = {
			loading: false,
			users: []
        };
        
        this.UserList = this.UserList.bind(this);
	}

	componentDidMount() {
		this.setState({ loading: true });
		this.props.firebase.users().on("value", (snapshot: any) => {
			const usersObject = snapshot.val();

			const usersList = Object.keys(usersObject).map(key => ({
				...usersObject[key],
				uid: key
			}));

			this.setState({
				users: usersList,
				loading: false
			});
		});
	}

	componentWillUnmount() {
		this.props.firebase.users().off();
	}

	render() {
		const { users, loading } = this.state;

		return (
			<div>
				<h1>{this.props.strings.admin}</h1>
				{loading && <div>Loading ...</div>}
				{this.UserList(users)}
			</div>
		);
	}

	UserList = (users: Array<{ username: string; email: string; uid: string }>)  => (
		<ul>
			{users.map(user => (
				<li key={user.uid}>
					<span>
						<strong>ID:</strong> {user.uid}
					</span>
					<span>
						<strong>{this.props.strings.email}:</strong>{" "}
						{user.email}
					</span>
					<span>
						<strong>{this.props.strings.username}:</strong>{" "}
						{user.username}
					</span>
				</li>
			))}
		</ul>
	);
}

const condition = (authUser: firebase.User | null) => !!authUser;

export default withAuthorization(condition)(withFirebase(useLocalization(AdminPage)));