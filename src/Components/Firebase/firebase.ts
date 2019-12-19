import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
	apiKey: "AIzaSyCZQ2LRVywK1Xb0sjsQ9frPVJ4lly1imN4",
	authDomain: "sdcalculatorweb.firebaseapp.com",
	databaseURL: "https://sdcalculatorweb.firebaseio.com",
	projectId: "sdcalculatorweb",
	storageBucket: "sdcalculatorweb.appspot.com",
	messagingSenderId: "382457531026",
	appId: "1:382457531026:web:f26874d892e16f39dff44b",
	measurementId: "G-THCEWPZ5JH"
};

class Firebase {
	auth: firebase.auth.Auth;
	db: firebase.database.Database;

	constructor() {
		app.initializeApp(config);

		this.auth = app.auth();

		this.db = app.database();
	}

	doCreateUserWithEmailAndPassword = (email: string, password: string) =>
		this.auth.createUserWithEmailAndPassword(email, password);
		
	doSignInWithEmailAndPassword = (email: string, password: string) =>
		this.auth.signInWithEmailAndPassword(email, password);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = (email: string) =>
		this.auth.sendPasswordResetEmail(email);

	doPasswordUpdate = (password: string) =>
		this.auth.currentUser && this.auth.currentUser.updatePassword(password);

	user = (uid: string) => this.db.ref(`users/${uid}`);

	users = () => this.db.ref(`users`);

	backup = (uid: string) => this.db.ref(`backups/${uid}`);

	bugs = () => this.db.ref(`bugs`);
}

export default Firebase;
