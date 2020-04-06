import React from "react";
import Firebase, { withFirebase } from "../../context/firebase";
import { GoNote } from "react-icons/go";

import "../../styles/notes/notes.scss";
import "../../styles/component/component.scss";

interface NotesProps {
    firebase: Firebase;
    lot: number;
}

interface NotesState {
    name: string;
    notes: string;
}

class Notes extends React.Component<NotesProps, NotesState> {
    constructor(props: NotesProps) {
        super(props);

        this.state = {
            name: "",
            notes: "",
        };
    }

    componentDidMount() {
        if (!this.props.firebase.auth.currentUser) return;

        this.props.firebase
            .backup(this.props.firebase.auth.currentUser.uid)
            .collection("lots")
            .doc(String(this.props.lot))
            .get()
            .then((snapshot) => {
                let notes = snapshot.data()?.notes as NotesState;

                this.setState({
                    name: notes.name,
                    notes: notes.notes,
                });
            });
    }

    toggleNotes = () => {
        const x = document.getElementById("notes__form") as HTMLElement;
        if (x.className === "notes__form") {
            x.className += " notes__form_expanded";
        } else {
            x.className = "notes__form";
        }
    };

    onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const uid = this.props.firebase.auth.currentUser?.uid;

        if (!uid) return;

        let doc = this.props.firebase
            .backup(uid)
            .collection("lots")
            .doc(String(this.props.lot));

        doc.get().then((snapshot) => {
            doc.set({
                models: snapshot.data()?.models,
                notes: {
                    name: this.state.name,
                    notes: this.state.notes,
                },
            });
        });
    };
    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();

        let name = event.currentTarget.name as "name";

        this.setState({ [name]: event.currentTarget.value });
    };
    onTextAreaChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        event.preventDefault();

        let name = event.currentTarget.name as "notes";

        this.setState({ [name]: event.currentTarget.value });
    };

    render() {
        return (
            <div className="notes">
                <button className="notes__toggle" onClick={this.toggleNotes}>
                    <GoNote />
                </button>
                <form
                    className="notes__form"
                    id="notes__form"
                    onSubmit={this.onSubmit}
                >
                    <p className="notes__label">Name</p>
                    <input
                        className="notes__input"
                        defaultValue={this.state.name}
                        name="name"
                        type="text"
                        onChange={this.onChange}
                    />
                    <p className="notes__label">Notes</p>
                    <textarea
                        className="notes__textarea"
                        defaultValue={this.state.notes}
                        name="notes"
                        onChange={this.onTextAreaChange}
                    />

                    <button className="component__button notes__submit">
                        Submit
                    </button>
                </form>
            </div>
        );
    }
}

export default withFirebase(Notes);
