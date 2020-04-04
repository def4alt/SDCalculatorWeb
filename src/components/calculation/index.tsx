import React from "react";

import Calculate from "./reader";
import { StatModel } from "../../types";
import Lot from "../lot/indes";
import Firebase, { withFirebase } from "../../context/firebase";

import "../../styles/component/component.scss";
import "../../styles/toggle-button/toggle-button.scss";
import "../../styles/file-browser/file-browser.scss";

interface CalculationProps {
    models: StatModel[];
    callback: (lot: number, models: StatModel[]) => void;
    firebase: Firebase;
}

interface CalculationState {
    sdMode: boolean;
    files: File[];
    lot: number;
}

class Calculation extends React.Component<CalculationProps, CalculationState> {
    authStateListener?: EventListener;

    constructor(props: CalculationProps) {
        super(props);

        this.state = {
            sdMode: true,
            lot: 0,
            files: [],
        };

        this.onSdModeChange = this.onSdModeChange.bind(this);
        this.onFilesChange = this.onFilesChange.bind(this);
    }

    componentWillUnmount() {
        this.authStateListener = undefined;

        if (this.props.firebase.auth.currentUser)
            this.props.firebase
                .backup(this.props.firebase.auth.currentUser.uid)
                .off();
    }

    // Handlers
    onSdModeChange = () => {
        this.setState({
            sdMode: !this.state.sdMode,
        });
    };
    onFilesChange = (event: React.FormEvent<HTMLInputElement>) => {
        let fileArray: File[] = [];

        const fileList: FileList = (event.currentTarget as HTMLInputElement)
            .files as FileList;

        for (let i = 0; i < fileList.length; i++) {
            fileArray.push(fileList[i]);
        }

        this.setState({ files: fileArray });
    };

    // Custom functions
    async calculate(files: File[], sdMode: boolean) {
        await Calculate(files, this.props.models, sdMode).then((models) => {
            this.props.callback(this.state.lot, models);

            if (!this.props.firebase.auth.currentUser) return;

            const backups = this.props.firebase.backup(
                this.props.firebase.auth.currentUser!.uid
            );

            backups.once("value", (snapshot: any) => {
                const object = snapshot.val();

                backups.set({
                    ...object,
                    [this.state.lot]: models,
                });
            });
        });
    }

    // Callbacks
    lotCallback = (lot: number) => {
        this.setState({ lot });

        if (!this.props.firebase.auth.currentUser) return;

        const backups = this.props.firebase.backup(
            this.props.firebase.auth.currentUser.uid
        );

        backups.once("value", (snapshot: any) => {
            let backupsObject: StatModel[] = snapshot.child(lot).val();

            this.props.callback(lot, backupsObject);
        });
    };

    render() {
        const { files, sdMode } = this.state;

        return (
            <div className="component component_centered">
                <div className="component__element">
                    <Lot callback={this.lotCallback} />
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
                                    onChange={this.onSdModeChange}
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
                            onChange={this.onFilesChange}
                        />
                        <span className="file-browser__text">
                            {files.length > 1
                                ? files.length + " selected"
                                : files.length === 1
                                ? files[0].name
                                : "Choose files..."}
                        </span>
                    </label>
                </div>

                <div className="component__element">
                    <button
                        className="component__button"
                        onClick={() => this.calculate(files, sdMode)}
                    >
                        {sdMode ? "Build charts" : "Add average"}
                    </button>
                </div>
            </div>
        );
    }
}

export default withFirebase(Calculation);
