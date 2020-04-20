import React, {
    useContext,
    useEffect,
    useReducer,
    Reducer,
    useRef,
} from "react";
import Firebase, { FirebaseContext } from "../../context/firebase";
import { AuthUserContext } from "../../context/session";
import { GoNote } from "react-icons/go";
import { LocalizationContext } from "../../context/localization";

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
    materialManufacturer?: string;
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

    const notesRef = useRef<HTMLFormElement | null>(null);

    const firebase = useContext(FirebaseContext) as Firebase;
    const user = useContext(AuthUserContext);
    const localization = useContext(LocalizationContext).localization;

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
    const toggleMenu = (
        ref: React.RefObject<HTMLElement>,
        className: string
    ) => {
        const menu = ref.current;

        if (!menu) return;

        if (!menu.classList.contains(className)) menu.classList.add(className);
        else menu.classList.remove(className);
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
                notes,
            });
        });
    };

    return (
        <div className="notes">
            <button
                className="notes__toggle button_icon"
                onClick={() => toggleMenu(notesRef, "notes__form_expanded")}
            >
                <GoNote />
            </button>
            <form className="notes__form" ref={notesRef} onSubmit={onSubmit}>
                <p className="notes__header">{localization.methodName}</p>
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

                <p className="notes__header">{localization.operatorName}</p>
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

                <p className="notes__header">{localization.foundingDate}</p>
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

                <p className="notes__header">{localization.controlMaterial}</p>
                <div className="notes__level">
                    <p className="notes__label">{localization.materialName}</p>
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
                    <p className="notes__label">
                        {localization.materialManufacturer}
                    </p>
                    <input
                        className="notes__input"
                        defaultValue={notes.materialManufacturer}
                        name="name"
                        type="text"
                        onChange={(e) =>
                            dispatch({
                                payload: {
                                    materialManufacturer: e.currentTarget.value,
                                },
                            })
                        }
                    />
                    <p className="notes__label">{localization.materialLot}</p>
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
                    <p className="notes__label">
                        {localization.materialExpDate}
                    </p>
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
                    <p className="notes__label">{localization.materialLvl1}</p>
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
                    <p className="notes__label">{localization.materialLvl2}</p>
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
                <p className="notes__header">{localization.machineName}</p>
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
                <br />
                <br />
                <br />
                <button className="button notes__submit">
                    {localization.submit}
                </button>
            </form>
        </div>
    );
};

export default Notes;
