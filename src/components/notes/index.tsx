import { h } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import { TargetedEvent } from "preact/compat";
import { FaRegFileAlt, FaTimes } from "react-icons/fa";
import { LocalizationContext } from "src/context/localization";
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

    const [showNotes, setShowNotes] = useState<boolean>(false);
    const { localization } = useContext(LocalizationContext);
    const user = useContext(UserContext);

    useEffect(() => {
        supabase
            .from("backups")
            .select("notes")
            .match({ user_id: user?.id, lot })
            .then((serverNotes) => {
                if (
                    serverNotes.data === null ||
                    serverNotes.data[0] === undefined
                )
                    return;

                setNotes(serverNotes.data[0] as NotesState);
            });
    }, [lot, user]);

    const onSubmit = async (event: TargetedEvent<HTMLFormElement, Event>) => {
        event.preventDefault();
        setShowNotes(false);

        await supabase
            .from("backups")
            .update({ notes })
            .match({ user_id: user?.id, lot });
    };

    return (
        <div class="w-full p-4">
            <button
                class="text-4xl w-20 h-20 text-gray-600 inline-flex justify-center items-center rounded-md hover:bg-gray-100  hover:cursor-pointer print:hidden"
                onClick={() => {
                    setShowNotes(!showNotes);
                }}
            >
                <FaRegFileAlt />
            </button>
            <form
                class={`border-2 fixed h-screen focus scroll-auto top-0 left-0 z-30 bg-white rounded-r-md flex flex-col gap-4 p-4 overflow-auto ease-in-out duration-300 ${
                    showNotes ? "translate-x-0" : "-translate-x-full"
                } print:translate-x-0 print:relative print:border-hidden`}
                onSubmit={onSubmit}
            >
                <div class="w-full flex justify-end items-center print:hidden">
                    <button
                        class="text-xl text-gray-500 hover:text-gray-600"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowNotes(false);
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>
                <div class="w-full">
                    <label
                        for="method_name"
                        class="block mb-2 text-sm w-full font-medium text-gray-900"
                    >
                        Method Name
                    </label>
                    <input
                        type="text"
                        name="method_name"
                        defaultValue={notes.methodName}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={(e) =>
                            setNotes((notes) =>
                                Object.assign(notes, {
                                    methodName: e.currentTarget.value,
                                })
                            )
                        }
                    />
                </div>
                <div class="w-full">
                    <label
                        for="operator_name"
                        class="block mb-2 text-sm w-full font-medium text-gray-900"
                    >
                        Operator Name
                    </label>
                    <input
                        type="text"
                        name="operator_name"
                        defaultValue={notes.operatorName}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={(e) =>
                            setNotes(
                                Object.assign(notes, {
                                    operatorName: e.currentTarget.value,
                                })
                            )
                        }
                    />
                </div>
                <div class="w-full">
                    <label
                        for="machine_name"
                        class="block mb-2 text-sm w-full font-medium text-gray-900"
                    >
                        Machine Name
                    </label>
                    <input
                        type="text"
                        name="machine_name"
                        defaultValue={notes.machineName}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={(e) =>
                            setNotes(
                                Object.assign(notes, {
                                    machineName: e.currentTarget.value,
                                })
                            )
                        }
                    />
                </div>
                <div class="w-full">
                    <label
                        for="founding_date"
                        class="block mb-2 text-sm w-full font-medium text-gray-900"
                    >
                        Founding Date
                    </label>
                    <input
                        type="date"
                        name="founding_date"
                        defaultValue={notes.foundingDate}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 print:appearance-none"
                        onChange={(e) =>
                            setNotes(
                                Object.assign(notes, {
                                    foundingDate: e.currentTarget.value,
                                })
                            )
                        }
                    />
                </div>

                <p class="">{localization.controlMaterial}</p>
                <div class="ml-8 border-l-2 flex flex-col gap-4 border-dashed border-spacing-4 p-4">
                    <div class="w-full">
                        <label
                            for="material_name_and_manufacturer"
                            class="block mb-2 text-sm w-full font-medium text-gray-900"
                        >
                            Material Name / Material Manufacturer
                        </label>
                        <input
                            type="text"
                            name="material_name_and_manufacturer"
                            defaultValue={notes.materialNameAndManufacturer}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={(e) =>
                                setNotes(
                                    Object.assign(notes, {
                                        materialNameAndManufacturer:
                                            e.currentTarget.value,
                                    })
                                )
                            }
                        />
                    </div>
                    <div class="w-full">
                        <label
                            for="material_expiration_date"
                            class="block mb-2 text-sm w-full font-medium text-gray-900"
                        >
                            Material Expiration Date
                        </label>
                        <input
                            type="date"
                            name="material_expiration_date"
                            defaultValue={notes.materialExpDate}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={(e) =>
                                setNotes(
                                    Object.assign(notes, {
                                        materialExpDate: e.currentTarget.value,
                                    })
                                )
                            }
                        />
                    </div>
                    <div class="w-full">
                        <label
                            for="material_level_1"
                            class="block mb-2 text-sm w-full font-medium text-gray-900"
                        >
                            Material Level 1
                        </label>
                        <input
                            type="text"
                            name="material_level_1"
                            defaultValue={notes.materialLvl1}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={(e) =>
                                setNotes(
                                    Object.assign(notes, {
                                        materialLvl1: e.currentTarget.value,
                                    })
                                )
                            }
                        />
                    </div>

                    <div class="w-full">
                        <label
                            for="material_level_2"
                            class="block mb-2 text-sm w-full font-medium text-gray-900"
                        >
                            Material Level 2
                        </label>
                        <input
                            type="text"
                            name="material_level_2"
                            defaultValue={notes.materialLvl2}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            onChange={(e) =>
                                setNotes(
                                    Object.assign(notes, {
                                        materialLvl2: e.currentTarget.value,
                                    })
                                )
                            }
                        />
                    </div>
                </div>

                <button class="w-full h-14 text-lg p-2 rounded-md bg-gray-100 hover:bg-gray-200 print:hidden">
                    {localization.submit}
                </button>
            </form>
        </div>
    );
};

export default Notes;
