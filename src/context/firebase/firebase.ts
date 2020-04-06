/// <reference path="../../images.d.ts"/>

import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import * as avatar from "../../../public/assets/avatars/1.png";

const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

class Firebase {
    auth: firebase.auth.Auth;
    db: firebase.firestore.Firestore;
    fbProvider: firebase.auth.AuthProvider;
    glProvider: firebase.auth.AuthProvider;

    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();

        this.fbProvider = new app.auth.FacebookAuthProvider();
        this.glProvider = new app.auth.GoogleAuthProvider();
        this.auth.useDeviceLanguage();

        this.db = app.firestore();
    }

    doCreateUserWithEmailAndPassword = (email: string, password: string) =>
        this.auth.createUserWithEmailAndPassword(email, password).then(user => {
            user.user?.updateProfile({
                photoURL: avatar
            });

            return user;
        });

    doSignInWithEmailAndPassword = (email: string, password: string) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignInWithGoogle = () => this.auth.signInWithPopup(this.glProvider);
    doSignInWithFacebook = () => this.auth.signInWithPopup(this.fbProvider);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = (email: string) =>
        this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = (password: string) =>
        this.auth.currentUser && this.auth.currentUser.updatePassword(password);

    user = (uid: string) => this.db.collection("users").doc(uid);

    users = () => this.db.collection("users");

    backup = (uid: string) => this.db.collection("backups").doc(uid);
}

export default Firebase;
