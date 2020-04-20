import React, { useContext, useEffect, useReducer, Reducer } from "react";
import Firebase, { FirebaseContext } from "../../context/firebase";
import { AuthUserContext } from "../../context/session";
import { GoNote } from "react-icons/go";

import "../../styles/notes/notes.scss";
import "../../styles/component/component.scss";
import "../../styles/button/button.scss";

interface NotesProps {
    lot: number;
}

interface NotesState {
    methodName?: string;
    operatorName?: string;
    foundingDate?: string;
    materialName?: string;
    materialProducer?: string;
    materialLot?: string;
    materialExpDate?: string;
    materialLvl1?: string;
    materialLvl2?: string;
    machineName?: string;
}

interface Action {
    type?: string;
    payload: NotesState;
}

const reducer: Reducer<NotesState, Action> = (state, action) => {
    switch (action.type) {
        default:
            return Object.assign({}, state, action.payload);
    }
};

const Notes: React.FC<NotesProps> = (props) => {
    const [notes, dispatch] = useReducer<
        Reducer<NotesState, Action>,
        NotesState
    >(reducer, {}, () => {
        return { materialLot: String(props.lot) } as NotesState;
    });

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

                if (!notes) return;

                dispatch({ payload: notes });
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

        console.log(notes);

        doc.get().then((snapshot) => {
            doc.set({
                models: snapshot.data()?.models,
                notes,
            });
        });
    };

    return (
        <div className="notes">
            <button className="notes__toggle" onClick={toggleNotes}>
                <GoNote />
            </button>
            <form className="notes__form" id="notes__form" onSubmit={onSubmit}>
                <p className="notes__header">Method name</p>
                <input
                    className="notes__input"
                    defaultValue={notes.methodName}
                    name="name"
                    type="text"
                    onChange={(e) =>
                        dispatch({
                            payload: { methodName: e.currentTarget.value },
                        })
                    }
                />

                <p className="notes__header">Operator name</p>
                <input
                    className="notes__input"
                    defaultValue={notes.operatorName}
                    name="name"
                    type="text"
                    onChange={(e) =>
                        dispatch({
                            payload: { operatorName: e.currentTarget.value },
                        })
                    }
                />

                <p className="notes__header">Date of founding mesurements</p>
                <input
                    className="notes__input"
                    defaultValue={notes.foundingDate}
                    name="name"
                    type="text"
                    onChange={(e) =>
                        dispatch({
                            payload: { foundingDate: e.currentTarget.value },
                        })
                    }
                />
                <br />

                <p className="notes__header">Control material</p>
                <div className="notes__level">
                    <p className="notes__label">Name</p>
                    <input
                        className="notes__input"
                        defaultValue={notes.materialName}
                        name="name"
                        type="text"
                        onChange={(e) =>
                            dispatch({
                                payload: {
                                    materialName: e.currentTarget.value,
                                },
                            })
                        }
                    />
                    <p className="notes__label">Manufacturer</p>
                    <input
                        className="notes__input"
                        defaultValue={notes.materialProducer}
                        name="name"
                        type="text"
                        onChange={(e) =>
                            dispatch({
                                payload: {
                                    materialProducer: e.currentTarget.value,
                                },
                            })
                        }
                    />
                    <p className="notes__label">Lot</p>
                    <input
                        className="notes__input"
                        defaultValue={notes.materialLot}
                        name="name"
                        type="text"
                        onChange={(e) =>
                            dispatch({
                                payload: { materialLot: e.currentTarget.value },
                            })
                        }
                    />
                    <p className="notes__label">Expiration date</p>
                    <input
                        className="notes__input"
                        defaultValue={notes.materialExpDate}
                        name="name"
                        type="text"
                        onChange={(e) =>
                            dispatch({
                                payload: {
                                    materialExpDate: e.currentTarget.value,
                                },
                            })
                        }
                    />
                    <p className="notes__label">Level 1</p>
                    <input
                        className="notes__input"
                        defaultValue={notes.materialLvl1}
                        name="name"
                        type="text"
                        onChange={(e) =>
                            dispatch({
                                payload: {
                                    materialLvl1: e.currentTarget.value,
                                },
                            })
                        }
                    />
                    <p className="notes__label">Level 2</p>
                    <input
                        className="notes__input"
                        defaultValue={notes.materialLvl2}
                        name="name"
                        type="text"
                        onChange={(e) =>
                            dispatch({
                                payload: {
                                    materialLvl2: e.currentTarget.value,
                                },
                            })
                        }
                    />
                </div>

                <br />
                <p className="notes__header">Measurements machine name</p>
                <input
                    className="notes__input"
                    defaultValue={notes.machineName}
                    name="name"
                    type="text"
                    onChange={(e) =>
                        dispatch({
                            payload: { machineName: e.currentTarget.value },
                        })
                    }
                />

                <button className="button notes__submit">Submit</button>
            </form>
        </div>
    );
};

export default Notes;
