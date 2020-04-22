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
import "../../styles/header/header.scss";

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
            {/*<div className="header notes__print-only">
                <img
                    className="header__image"
                    alt="ohmatdyt logo"
                    src="https://scontent.fiev12-1.fna.fbcdn.net/v/t31.0-8/p960x960/27164021_1923262394651155_2381188020606320187_o.png?_nc_cat=103&_nc_sid=85a577&_nc_ohc=yOxOuE34ZxgAX8AxDT6&_nc_ht=scontent.fiev12-1.fna&oh=dab891cac1968553724ab997034d9ec5&oe=5EC5698B"
                />
                <p className="header__label">
                    МІНІСТЕРСТВО ОХОРОНИ ЗДОРОВ’Я УКРАЇНИ НАЦІОНАЛЬНА ДИТЯЧА
                    СПЕЦІАЛІЗОВАНА ЛІКАРНЯ «ОХМАТДИТ»
                </p>
                <p className="header__right-top">Ф-ЛМГ-010-01</p>
                <p className="header__text">Лабораторія медичної генетики</p>
                <p className="header__text_second">
                    Відділ діагностики спадкової патології
                </p>
                <p className="header__title">
                    ВНУТРІШНЬОЛАБОРАТОРНИЙ КОНТРОЛЬ ЯКОСТІ
                </p>
    </div>*/}
            <button
                className="notes__toggle button_icon"
                onClick={() => toggleMenu(notesRef, "notes__form_expanded")}
            >
                <GoNote />
            </button>
            <form className="notes__form" ref={notesRef} onSubmit={onSubmit}>
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
                    <p className="notes__label">{localization.materialName}</p>
                    <input
                        className="notes__input"
                        defaultValue={notes.materialName}
                        name="materialName"
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
                        name="materialManufacturer"
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
                        name="materialLot"
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
                        name="materialExpDate"
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
