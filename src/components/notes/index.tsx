import React, {
    Reducer,
    useContext,
    useEffect,
    useReducer,
    useRef,
} from "react";
import { FirebaseContext } from "../../context/firebase";
import { AuthUserContext } from "../../context/session";
import { GoNote } from "react-icons/go";
import { LocalizationContext } from "../../context/localization";

import "../../styles/notes/notes.scss";
import "../../styles/button/button.scss";
import "../../styles/header/header.scss";

interface NotesProps {
    lot: number;
}

interface NotesState {
    methodName?: string;
    operatorName?: string;
    foundingDate?: string;
    materialNameAndManufacturer?: string;
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
    const floatingNotesRef = useRef<HTMLFormElement | null>(null);

    const firebase = useContext(FirebaseContext);
    const user = useContext(AuthUserContext);
    const localization = useContext(LocalizationContext).localization;

    useEffect(() => {
        if (!user || !firebase) return;

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
    }, [firebase, props.lot, user]);
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

        if (!user || !firebase) return;

        firebase
            .backup(user.uid)
            .collection("lots")
            .doc(String(props.lot))
            .get()
            .then((snapshot) => {
                firebase
                    .backup(user.uid)
                    .collection("lots")
                    .doc(String(props.lot))
                    .set({
                        models: snapshot.data()?.models,
                        notes,
                    });
            });
    };

    return (
        <div className="notes">
            <button
                className="notes__toggle button_icon"
                onClick={() => {
                    toggleMenu(notesRef, "notes__form_expanded");
                    toggleMenu(floatingNotesRef, "notes__form_expanded");
                }}
            >
                <GoNote />
            </button>
            <form
                className="notes__form notes__form_elevated"
                ref={floatingNotesRef}
                onSubmit={onSubmit}
            >
                <p className="notes__title">{localization.methodName}</p>
                <input
                    className="notes__input"
                    defaultValue={notes.methodName}
                    name="methodName"
                    type="text"
                    onChange={(e) =>
                        dispatch({
                            payload: { methodName: e.currentTarget.value },
                        })
                    }
                />

                <p className="notes__title">{localization.operatorName}</p>
                <input
                    className="notes__input"
                    defaultValue={notes.operatorName}
                    name="operatorName"
                    type="text"
                    onChange={(e) =>
                        dispatch({
                            payload: { operatorName: e.currentTarget.value },
                        })
                    }
                />

                <p className="notes__title">{localization.machineName}</p>
                <input
                    className="notes__input"
                    defaultValue={notes.machineName}
                    name="machineName"
                    type="text"
                    onChange={(e) =>
                        dispatch({
                            payload: { machineName: e.currentTarget.value },
                        })
                    }
                />

                <p className="notes__title">{localization.foundingDate}</p>
                <input
                    className="notes__input"
                    defaultValue={notes.foundingDate}
                    name="foundingDate"
                    type="date"
                    onChange={(e) =>
                        dispatch({
                            payload: { foundingDate: e.currentTarget.value },
                        })
                    }
                />
                <br />

                <p className="notes__title">{localization.controlMaterial}</p>
                <div className="notes__level">
                    <p className="notes__label">
                        {localization.materialName} /{" "}
                        {localization.materialManufacturer}
                    </p>
                    <input
                        className="notes__input"
                        defaultValue={notes.materialNameAndManufacturer}
                        name="materialNameAndManufacturer"
                        type="text"
                        onChange={(e) =>
                            dispatch({
                                payload: {
                                    materialNameAndManufacturer:
                                        e.currentTarget.value,
                                },
                            })
                        }
                    />
                    <p className="notes__label">
                        {localization.materialExpDate}
                    </p>
                    <input
                        className="notes__input"
                        defaultValue={notes.materialExpDate}
                        name="materialExpDate"
                        type="date"
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
                        name="materialLvl1"
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
                        name="materialLvl2"
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
                <br />
                <button className="button notes__submit">
                    {localization.submit}
                </button>
            </form>
            <form
                className="notes__form"
                ref={notesRef}
                onSubmit={onSubmit}
            ></form>
        </div>
    );
};

export default Notes;
