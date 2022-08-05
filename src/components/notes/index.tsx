import { h } from "preact";
import { useState, useContext, useEffect, useRef } from "preact/hooks";
import { TargetedEvent } from "preact/compat";
import { FaRegFileAlt } from "react-icons/fa";
import { LocalizationContext } from "src/context/localization";

import "src/styles/notes/notes.scss";
import "src/styles/button/button.scss";
import "src/styles/header/header.scss";
import { UserContext } from "src/app";
import { supabase } from "src/context/supabase/api";

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

const Notes: React.FC<NotesProps> = ({ lot }) => {
    const [notes, setNotes] = useState<NotesState>({
        materialLot: String(lot),
    });

    const notesRef = useRef<HTMLFormElement | null>(null);
    const { localization } = useContext(LocalizationContext);
    const user = useContext(UserContext);

    useEffect(() => {
        supabase
            .from("backups")
            .select("notes")
            .match({ user_id: user?.id, lot })
            .then((serverNotes) => {
                if (serverNotes.data === null) return;

                setNotes(serverNotes.data[0] as NotesState);
            });
    }, [lot, user]);

    const toggleMenu = (
        ref: React.RefObject<HTMLElement>,
        className: string
    ) => {
        const menu = ref.current;

        if (!menu) return;

        if (!menu.classList.contains(className)) menu.classList.add(className);
        else menu.classList.remove(className);
    };

    const onSubmit = async (event: TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();

        await supabase
            .from("backups")
            .update({ notes })
            .match({ id: user?.id, lot });
    };

    return (
        <div className="notes">
            <button
                className="notes__toggle button_icon"
                onClick={() => {
                    toggleMenu(notesRef, "notes__form_expanded");
                }}
            >
                <FaRegFileAlt />
            </button>
            <form className="notes__form" ref={notesRef} onSubmit={onSubmit}>
                <label className="notes__label">
                    {localization.methodName}
                    <input
                        className="notes__input"
                        defaultValue={notes.methodName}
                        name="methodName"
                        type="text"
                        onChange={(e) =>
                            setNotes(
                                Object.assign(notes, {
                                    methodName: e.currentTarget.value,
                                })
                            )
                        }
                    />
                </label>

                <label className="notes__label">
                    {localization.operatorName}
                    <input
                        className="notes__input"
                        defaultValue={notes.operatorName}
                        name="operatorName"
                        type="text"
                        onChange={(e) =>
                            Object.assign(notes, {
                                operatorName: e.currentTarget.value,
                            })
                        }
                    />
                </label>

                <label className="notes__label">
                    {localization.machineName}
                    <input
                        className="notes__input"
                        defaultValue={notes.machineName}
                        name="machineName"
                        type="text"
                        onChange={(e) =>
                            Object.assign(notes, {
                                machineName: e.currentTarget.value,
                            })
                        }
                    />
                </label>
                <label className="notes__label">
                    {localization.foundingDate}
                    <input
                        className="notes__input"
                        defaultValue={notes.foundingDate}
                        name="foundingDate"
                        type="date"
                        onChange={(e) =>
                            Object.assign(notes, {
                                foundingDate: e.currentTarget.value,
                            })
                        }
                    />
                </label>
                <br />

                <p className="notes__title">{localization.controlMaterial}</p>
                <div className="notes__level">
                    <label className="notes__label">
                        {localization.materialName} /{" "}
                        {localization.materialManufacturer}
                        <input
                            className="notes__input"
                            defaultValue={notes.materialNameAndManufacturer}
                            name="materialNameAndManufacturer"
                            type="text"
                            onChange={(e) =>
                                Object.assign(notes, {
                                    materialNameAndManufacturer:
                                        e.currentTarget.value,
                                })
                            }
                        />
                    </label>
                    <label className="notes__label">
                        {localization.materialExpDate}

                        <input
                            className="notes__input"
                            defaultValue={notes.materialExpDate}
                            name="materialExpDate"
                            type="date"
                            onChange={(e) =>
                                Object.assign(notes, {
                                    materialExpDate: e.currentTarget.value,
                                })
                            }
                        />
                    </label>
                    <label className="notes__label">
                        {localization.materialLvl1}
                        <input
                            className="notes__input"
                            defaultValue={notes.materialLvl1}
                            name="materialLvl1"
                            type="text"
                            onChange={(e) =>
                                Object.assign(notes, {
                                    materialLvl1: e.currentTarget.value,
                                })
                            }
                        />
                    </label>
                    <label className="notes__label">
                        {localization.materialLvl2}
                        <input
                            className="notes__input"
                            defaultValue={notes.materialLvl2}
                            name="materialLvl2"
                            type="text"
                            onChange={(e) =>
                                Object.assign(notes, {
                                    materialLvl2: e.currentTarget.value,
                                })
                            }
                        />
                    </label>
                </div>

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
