import React, { useState, useContext, useEffect } from "react";
import Firebase, { FirebaseContext } from "../../context/firebase";
import { GoNote } from "react-icons/go";

import "../../styles/notes/notes.scss";
import "../../styles/component/component.scss";
import { AuthUserContext } from "../../context/session";

interface NotesProps {
    lot: number;
}

interface NotesState {
    name?: string;
    notes?: string;
}

// TODO: Ask for notes fields

const Notes: React.FC<NotesProps> = (props) => {
    const [name, setName] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    const firebase = useContext(FirebaseContext) as Firebase;
    const user = useContext(AuthUserContext) as firebase.User;

    useEffect(() => {
        if (!user) return;

        firebase
            .backup(user.uid)
            .collection("lots")
            .doc(String(props.lot))
            .get()
            .then((snapshot) => {
                const notes = snapshot.data()?.notes as NotesState;

                setName(notes.name as string);
                setNotes(notes.notes as string);
            });
    });

    const toggleNotes = () => {
        const x = document.getElementById("notes__form") as HTMLElement;
        if (x.className === "notes__form") {
            x.className += " notes__form_expanded";
        } else {
            x.className = "notes__form";
        }
    };

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const uid = firebase.auth.currentUser?.uid;

        if (!uid) return;

        let doc = firebase
            .backup(uid)
            .collection("lots")
            .doc(String(props.lot));

        doc.get().then((snapshot) => {
            doc.set({
                models: snapshot.data()?.models,
                notes: {
                    name,
                    notes,
                },
            });
        });
    };

    return (
        <div className="notes">
            <button className="notes__toggle" onClick={toggleNotes}>
                <GoNote />
            </button>
            <form className="notes__form" id="notes__form" onSubmit={onSubmit}>
                <p className="notes__label">Name</p>
                <input
                    className="notes__input"
                    defaultValue={name}
                    name="name"
                    type="text"
                    onChange={(e) => setName(e.currentTarget.value)}
                />
                <p className="notes__label">Notes</p>
                <textarea
                    className="notes__textarea"
                    defaultValue={notes}
                    name="notes"
                    onChange={(e) => setNotes(e.currentTarget.value)}
                />

                <button className="component__button notes__submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Notes;
