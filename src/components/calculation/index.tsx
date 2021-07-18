import React, { useState, useContext } from "react";

import readerCalculate from "./reader";
import { StatModel } from "../../types";
import Lot from "../lot";
import firebase from "firebase";

import { FirebaseContext } from "../../context/firebase";
import { AuthUserContext } from "../../context/session";
import { LocalizationContext } from "../../context/localization";

import "../../styles/toggle-button/toggle-button.scss";
import "../../styles/calculation/calculation.scss";
import "../../styles/file-browser/file-browser.scss";
import "../../styles/avatar/avatar.scss";
import "../../styles/button/button.scss";

interface CalculationProps {
    callback: (lot: number, models: StatModel[]) => void;
}

// TODO: Add other calculation types

const Calculation: React.FC<CalculationProps> = (props: CalculationProps) => {
    const localization = useContext(LocalizationContext).localization;

    const [lot, setLot] = useState<number>(0);
    const [sdMode, setSdMode] = useState<boolean>(true);
    const [files, setFiles] = useState<File[]>([]);
    const [models, setModels] = useState<StatModel[]>([]);

    const firebase = useContext(FirebaseContext);
    const user = useContext(AuthUserContext);

    const onFilesChange = (event: React.FormEvent<HTMLInputElement>) => {
        let fileArray: File[] = [];

        const fileList: FileList = (event.currentTarget as HTMLInputElement)
            .files as FileList;

        for (let i = 0; i < fileList.length; i++) {
            fileArray.push(fileList[i]);
        }

        setFiles(fileArray);
    };

    const calculate = async (files: File[], sdMode: boolean) => {
        await readerCalculate(files, models, sdMode).then((modelsResult) => {
            if (modelsResult.isErr()) {
                console.error(
                    `Calculation Error: ${modelsResult.error.message}`
                );
                return;
            }
            props.callback(lot, modelsResult.value);
            setModels(modelsResult.value);

            if (!user || !firebase) return;

            firebase
                .backup(user.uid)
                .collection("lots")
                .doc(String(lot))
                .set({
                    models: modelsResult.value,
                    notes: {},
                } as firebase.firestore.DocumentData);
        });
    };

    const lotCallback = (lot: number) => {
        setLot(lot);

        if (!user || !firebase) return;

        firebase
            .backup(user.uid)
            .collection("lots")
            .doc(String(lot))
            .get()
            .then((snapshot: any) => {
                if (snapshot.data()) {
                    setModels(snapshot.data()?.models);
                    props.callback(lot, snapshot.data()?.models);
                } else {
                    setModels([]);
                    props.callback(lot, []);
                }
            });
    };

    const fileSelectText =
        files.length > 1
            ? files.length + " " + localization.selected
            : files.length === 1
            ? files[0].name
            : localization.selectFiles + "...";

    return (
        <div className="calculation">
            <Lot callback={lotCallback} />

            <div className="calculation__mode-select">
                <p className="toggle-button__text">{localization.addAverage}</p>
                <div className="toggle-button">
                    <div className="toggle-button__cover">
                        <div className="toggle-button__button">
                            <input
                                type="checkbox"
                                className="toggle-button__checkbox"
                                aria-label="Mode toggle"
                                checked={sdMode}
                                onChange={() => setSdMode(!sdMode)}
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
                        multiple={sdMode}
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
                    className={"button " + (sdMode ? "" : "button__green")}
                    onClick={() => calculate(files, sdMode)}
                >
                    {sdMode
                        ? localization.buildCharts
                        : localization.addAverage}
                </button>
            </div>
        </div>
    );
};

export default Calculation;
