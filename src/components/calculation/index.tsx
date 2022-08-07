import { h } from "preact";
import { useContext, useMemo } from "preact/hooks";
import { useState } from "preact/compat";
import { ProcessedData } from "src/types/common";
import Lot from "src/components/lot";
import { LocalizationContext } from "src/context/localization";
import { read } from "./reader";
import { processData } from "./processor";
import { checkWestgardViolations } from "./westgard";
import {
    getFirstMatchedField,
    insertField,
    updateField,
} from "src/context/supabase/api";
import { UserContext } from "src/app";
import { TargetedEvent } from "preact/compat";

enum Mode {
    SD,
    Average,
}

interface CalculationProps {
    callback: (lot: number, data: ProcessedData[]) => void;
}

const Calculation: React.FC<CalculationProps> = ({ callback }) => {
    const localization = useContext(LocalizationContext).localization;

    const [mode, setMode] = useState<Mode>(Mode.SD);
    const [files, setFiles] = useState<File[]>([]);
    const [data, setData] = useState<ProcessedData[]>([]);
    const [lot, setLot] = useState<number>(0);
    const user = useContext(UserContext);

    const onFilesChange = (event: TargetedEvent<HTMLInputElement>) => {
        let fileArray: File[] = [];

        const fileList: FileList = (event.currentTarget as HTMLInputElement)
            .files as FileList;

        for (let i = 0; i < fileList.length; i++) {
            fileArray.push(fileList[i]);
        }

        setFiles(fileArray);
    };

    const calculate = async (files: File[], mode: Mode) => {
        const rawData = await read(files);
        let processedData = processData(rawData);

        let result: ProcessedData[] = [];

        switch (mode) {
            case Mode.SD:
                result = processedData;
                break;
            case Mode.Average:
                result = appendNewData(data, processedData);
                break;

            default:
                break;
        }

        if (user !== null) {
            const dataResult = await getFirstMatchedField(user.id, lot, "all");

            if (dataResult.isOk())
                updateField(user.id, lot, "data", result).then((r) => {
                    if (r.isErr()) console.error(r.error);
                });
            else
                insertField({ user_id: user.id, lot, data }).then((r) => {
                    if (r.isErr()) console.error(r.error);
                });
        }

        setData(result);
        callback(lot, result);
    };

    const appendNewData = (
        oldData: ProcessedData[],
        newData: ProcessedData[]
    ): ProcessedData[] => {
        let result: ProcessedData[] = [];

        Object.assign(result, oldData);

        newData.forEach((element) => {
            const data = result
                .filter(
                    (t) =>
                        t.TestName === element.TestName &&
                        t.SampleType == element.SampleType
                )
                .at(0);

            if (!data) return;

            data.Values.push(element.Values[0]);
            data.Dates.push(element.Dates[0]);
            data.Warnings = checkWestgardViolations(
                data.Values.concat(element.Values),
                data.Values[0],
                data.SD
            );
        });

        return result;
    };

    const lotCallback = (lot: number) => {
        setLot(lot);

        if (user === null) return;

        getFirstMatchedField<ProcessedData[]>(user.id, lot, "data").then(
            (r) => {
                if (r.isErr()) {
                    console.error(r.error.message);
                    return;
                }

                setData(r.value);

                if (r.value.length > 0) callback(lot, r.value);
            }
        );
    };

    const color = useMemo(() => {
        return mode === Mode.SD ? "blue" : "green";
    }, [mode]);

    return (
        <div class="w-full h-screen flex flex-col justify-center gap-10 items-center print:hidden">
            {user !== null ? (
                <Lot callback={lotCallback} />
            ) : (
                <div class="text-red-600 text-lg border-2 border-red-400 rounded-md p-3">
                    {localization.userIsNotSignedIn}
                </div>
            )}{" "}
            <div class="w-1/2 flex align-middle items-center justify-center">
                <span class="mr-3 text-md text-center">
                    {localization.addAverage}
                </span>
                <label
                    for="mode-select"
                    class="inline-flex relative items-center cursor-pointer"
                >
                    <input
                        type="checkbox"
                        value=""
                        id="mode-select"
                        class="sr-only peer "
                        checked={mode === Mode.SD ? true : false}
                        onChange={() => {
                            setMode((mode) =>
                                mode === Mode.SD ? Mode.Average : Mode.SD
                            );
                        }}
                    />
                    <div class="w-16 h-9  bg-green-500 border-2 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-200 hover:border-green-200 hover:bg-green-600 hover:peer-checked:border-blue-200 hover:peer-checked:bg-blue-600 peer-focus:peer-checked:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-white after:border after:rounded-full after:h-7 after:w-7 after:transition-all  peer-checked:bg-blue-500"></div>
                </label>
                <span class="ml-3 text-md text-center">
                    {localization.buildCharts}
                </span>
            </div>
            <div class="w-1/2 h-14 flex justify-center align-middle items-center border-2 rounded-md px-2 py-4 border-gray-200">
                <label class="block w-full">
                    <span class="sr-only">{localization.chooseDataFiles}</span>
                    <input
                        type="file"
                        class="block w-full text-center file:w-full sm:text-left sm:file:w-36 font-bold text-sm text-gray-500 file:hover:cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-gray-100 file:rounded-md file:border-2 file:border-solid file:shadow-none file:text-sm file:font-semibold file:bg-gray-200 hover:file:bg-gray-300 hover:file:border-gray-200"
                        multiple={mode === Mode.SD ? true : false}
                        onChange={onFilesChange}
                    />
                </label>
            </div>
            <div class="w-1/2">
                <button
                    class={`bg-${color}-500 text-white text-md font-bold rounded-md border-2 w-full h-9 hover:cursor-pointer hover:bg-${color}-600 hover:border-${color}-200`}
                    onClick={() => calculate(files, mode)}
                >
                    {mode === Mode.SD
                        ? localization.buildCharts
                        : localization.addAverage}
                </button>
            </div>
        </div>
    );
};

export default Calculation;
