import React, { useState, useContext } from "react";

import Calculate from "./reader";
import { StatModel } from "../../types";
import Lot from "../lot/indes";

import Firebase, { FirebaseContext } from "../../context/firebase";
import { AuthUserContext } from "../../context/session";

import "../../styles/component/component.scss";
import "../../styles/toggle-button/toggle-button.scss";
import "../../styles/file-browser/file-browser.scss";
import "../../styles/calculation/calculation.scss";
import "../../styles/avatar/avatar.scss";
import "../../styles/button/button.scss";

interface CalculationProps {
    callback: (lot: number, models: StatModel[]) => void;
}

// TODO: Add other calculation types

const Calculation: React.FC<CalculationProps> = (props) => {
    const [lot, setLot] = useState<number>(0);
    const [sdMode, setSdMode] = useState<boolean>(true);
    const [files, setFiles] = useState<File[]>([]);
    const [models, setModels] = useState<StatModel[]>([]);

    const firebase = useContext(FirebaseContext) as Firebase;
    const user = useContext(AuthUserContext) as firebase.User;

    const onSdModeChange = () => setSdMode(!sdMode);
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
        await Calculate(files, models, sdMode).then(async (models) => {
            props.callback(lot, models);
            setModels(models);

            if (!user) return;

            await firebase
                .backup(user.uid)
                .collection("lots")
                .doc(String(lot))
                .set({
                    models: models,
                    notes: {},
                });
        });
    };

    const lotCallback = async (lot: number) => {
        setLot(lot);

        if (!user) return;

        const doc = firebase
            .backup(user.uid)
            .collection("lots")
            .doc(String(lot));

        await doc.get().then((snapshot) => {
            if (snapshot.data()) {
                props.callback(lot, snapshot.data()?.models);
                setModels(snapshot.data()?.models);
            } else {
                props.callback(lot, []);
                setModels([]);
            }
        });
    };

    let fileSelectText =
        files.length > 1
            ? files.length + " selected"
            : files.length === 1
            ? files[0].name
            : "Choose files...";

    return (
        <div className="component calculation">
            <div className="component__element">
                <Lot callback={lotCallback} />
            </div>

            <div className="component__element component__element_centered">
                <p>Add average</p>
                <div className="toggle-button">
                    <div className="toggle-button__cover">
                        <div className="toggle-button__button">
                            <input
                                type="checkbox"
                                className="toggle-button__checkbox"
                                checked={sdMode}
                                onChange={onSdModeChange}
                            />
                            <div className="toggle-button__knobs"></div>
                            <div className="toggle-button__layer"></div>
                        </div>
                    </div>
                </div>
                <p>Build chart</p>
            </div>

            <div className="component__element">
                <p>Select files:</p>

                <label className="file-browser">
                    <input
                        type="file"
                        aria-label="File browser"
                        multiple={sdMode}
                        onChange={onFilesChange}
                    />
                    <span className="file-browser__text">{fileSelectText}</span>
                </label>
            </div>

            <div className="component__element">
                <button
                    className="button"
                    onClick={() => calculate(files, sdMode)}
                >
                    {sdMode ? "Build charts" : "Add average"}
                </button>
            </div>
        </div>
    );
};

export default Calculation;
