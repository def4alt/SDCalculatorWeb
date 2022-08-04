import React, { useState, useContext } from "react";

import { ProcessedData } from "src/types";
import Lot from "Components/lot";

import { LocalizationContext } from "Context/localization";

import "Styles/toggle-button/toggle-button.scss";
import "Styles/calculation/calculation.scss";
import "Styles/file-browser/file-browser.scss";
import "Styles/avatar/avatar.scss";
import "Styles/button/button.scss";
import { read } from "./reader";
import { processData } from "./processor";
import { checkWestgardViolations } from "./westgard";
import { supabase } from "Context/supabase/api";
import { UserContext } from "src/app";

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

    const onFilesChange = (event: React.FormEvent<HTMLInputElement>) => {
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

    const lotCallback = (lot: number, data: ProcessedData[]) => {
        setLot(lot);
        setData(data);

        if (data.length > 0) callback(lot, data);
    };

    const fileSelectText =
        files.length > 1
            ? files.length + " " + localization.selected
            : files.length === 1
            ? files[0].name
            : localization.selectFiles + "...";

    return (
        <div className="calculation">
            {user !== null ? (
                <Lot callback={lotCallback} />
            ) : (
                <div className="calculation__lot">User is not signed in</div>
            )}{" "}
            <div className="calculation__mode-select">
                <p className="toggle-button__text">{localization.addAverage}</p>
                <div className="toggle-button">
                    <div className="toggle-button__cover">
                        <div className="toggle-button__button">
                            <input
                                type="checkbox"
                                className="toggle-button__checkbox"
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
                            <div className="toggle-button__knobs" />
                            <div className="toggle-button__layer" />
                        </div>
                    </div>
                </div>
                <p className="toggle-button__text">
                    {localization.buildCharts}
                </p>
            </div>
            <div className="calculation__file-select">
                <label className="file-browser">
                    <input
                        type="file"
                        aria-label="File browser"
                        multiple={mode === Mode.SD ? true : false}
                        onChange={onFilesChange}
                    />
                    <span
                        className={
                            "file-browser__text " +
                            "file-browser__text_" +
                            localization.getLanguage()
                        }
                    >
                        {fileSelectText}
                    </span>
                </label>
            </div>
            <div className="calculation__submit">
                <button
                    className={
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
