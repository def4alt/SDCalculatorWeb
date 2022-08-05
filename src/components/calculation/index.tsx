import { h } from "preact";
import { useContext } from "preact/hooks";
import { useState } from "preact/compat";

import { ProcessedData } from "src/types";
import Lot from "src/components/lot";

import { LocalizationContext } from "src/context/localization";

import "src/styles/toggle-button/toggle-button.scss";
import "src/styles/calculation/calculation.scss";
import "src/styles/file-browser/file-browser.scss";
import "src/styles/avatar/avatar.scss";
import "src/styles/button/button.scss";
import { read } from "./reader";
import { processData } from "./processor";
import { checkWestgardViolations } from "./westgard";
import { supabase } from "src/context/supabase/api";
import { UserContext } from "src/app";
import { TargetedEvent } from "preact/compat";

// TODO: Add other calculation types

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
            const { data } = await supabase
                .from("backups")
                .select()
                .match({ user_id: user.id, lot })
                .limit(1)
                .single();

            if (data !== null)
                await supabase
                    .from("backups")
                    .update({ data: result })
                    .match({ lot, user_id: user.id });
            else
                await supabase
                    .from("backups")
                    .insert([{ lot, user_id: user.id, data: result }]);
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

        supabase
            .from("backups")
            .select("data")
            .match({ user_id: user?.id, lot })
            .limit(1)
            .single()
            .then((response) => {
                if (response.data === null || response.error !== null) return;

                const response_data = response.data.data;
                setData(response_data);

                if (response_data.length > 0) callback(lot, response_data);
            });
    };

    const fileSelectText =
        files.length > 1
            ? files.length + " " + localization.selected
            : files.length === 1
            ? files[0].name
            : localization.selectFiles + "...";

    return (
        <div class="calculation">
            {user !== null ? (
                <Lot callback={lotCallback} />
            ) : (
                <div class="calculation__lot">User is not signed in</div>
            )}{" "}
            <div class="calculation__mode-select">
                <p class="toggle-button__text">{localization.addAverage}</p>
                <div class="toggle-button">
                    <div class="toggle-button__cover">
                        <div class="toggle-button__button">
                            <input
                                type="checkbox"
                                class="toggle-button__checkbox"
                                aria-label="Mode toggle"
                                checked={mode === Mode.SD ? true : false}
                                onChange={() => {
                                    switch (mode) {
                                        case Mode.SD:
                                            setMode(Mode.Average);
                                            break;
                                        case Mode.Average:
                                            setMode(Mode.SD);
                                            break;

                                        default:
                                            break;
                                    }
                                }}
                            />
                            <div class="toggle-button__knobs" />
                            <div class="toggle-button__layer" />
                        </div>
                    </div>
                </div>
                <p class="toggle-button__text">{localization.buildCharts}</p>
            </div>
            <div class="calculation__file-select">
                <label class="file-browser">
                    <input
                        type="file"
                        aria-label="File browser"
                        multiple={mode === Mode.SD ? true : false}
                        onChange={onFilesChange}
                    />
                    <span
                        class={
                            "file-browser__text " +
                            "file-browser__text_" +
                            localization.getLanguage()
                        }
                    >
                        {fileSelectText}
                    </span>
                </label>
            </div>
            <div class="calculation__submit">
                <button
                    class={
                        "button " + (mode === Mode.SD ? "" : "button__green")
                    }
                    onClick={() => calculate(files, mode)}
                >
                    {mode ? localization.buildCharts : localization.addAverage}
                </button>
            </div>
        </div>
    );
};

export default Calculation;
