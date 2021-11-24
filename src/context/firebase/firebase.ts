import { initializeApp, getApps, getApp } from "firebase/app";
import {
    getAuth,
    FacebookAuthProvider,
    GoogleAuthProvider,
    Auth,
    AuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile
} from "firebase/auth";
import { getFirestore, Firestore, doc, collection } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
class Firebase {
    auth: Auth;
    db: Firestore;
    fbProvider: AuthProvider;
    glProvider: AuthProvider;

    constructor() {
        if (!getApps().length) {
            initializeApp(firebaseConfig);
        } else {
            getApp();
        }

        this.auth = getAuth();

        this.fbProvider = new FacebookAuthProvider();
        this.glProvider = new GoogleAuthProvider();
        this.auth.useDeviceLanguage();

        this.db = getFirestore();
    }

    createUserWithEmailAndPassword = (email: string, password: string) =>
        createUserWithEmailAndPassword(this.auth, email, password).then(
            (user) => {
                const cdnFilesCount = 104;
                const index = Math.floor(Math.random() * cdnFilesCount + 1);
                updateProfile(user.user, {
                    photoURL: `https://cdn.image4.io/def4alt/f_auto/avatars/${index}.png`,
                });

                return user;
            }
        );

    signInWithEmailAndPassword = (email: string, password: string) =>
        signInWithEmailAndPassword(this.auth, email, password);

    signInWithGoogle = () => signInWithPopup(this.auth, this.glProvider);
    signInWithFacebook = () => signInWithPopup(this.auth, this.fbProvider);

    signOut = () => this.auth.signOut();

    resetPassword = (email: string) => sendPasswordResetEmail(this.auth, email);

    updatePassword = (password: string) =>
        this.auth.currentUser && updatePassword(this.auth.currentUser, password);

    user = (uid: string) => doc(this.db, "users", uid);

    users = () => collection(this.db, "users");

    backup = (uid: string) => doc(this.db, "backups", uid);
}

export default Firebase;
