import React from "react";

import "./calculation.scss";
import Calculate from "./reader";
import { StatModel } from "../../types";
import Lot from "../lot/indes";
import Firebase, { withFirebase } from "../../context/firebase";

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
            files: []
        };

        this.onSdModeChange = this.onSdModeChange.bind(this);
        this.onFilesChange = this.onFilesChange.bind(this);
    }

    componentWillUnmount() {
        this.authStateListener = undefined;
    }

    // Handlers
    onSdModeChange = () => {
        this.setState({
            sdMode: !this.state.sdMode
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
        await Calculate(files, this.props.models, sdMode).then(models =>
            this.props.callback(this.state.lot, models)
        );
    }

    // Callbacks
    lotCallback = (lot: number) => {
        this.setState({ lot: lot });

        if (!this.props.firebase.auth.currentUser) return;

        const backups = this.props.firebase.backup(
            this.props.firebase.auth.currentUser.uid
        );

        backups.on("value", (snapshot: any) => {
            var backupsObject: StatModel[] = snapshot.child(lot).val();

            this.props.callback(lot, backupsObject);
        });
    };

    render() {
        return (
            <div className="calculation">
                <div id="lot">
                    <Lot callback={this.lotCallback} />
                </div>

                <div id="modeSelect">
                    <p>Add average</p>
                    <div className="toggle-button-cover">
                        <div className="button-cover">
                            <div className="button r" id="button-3">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={this.state.sdMode}
                                    onChange={this.onSdModeChange}
                                />
                                <div className="knobs"></div>
                                <div className="layer"></div>
                            </div>
                        </div>
                    </div>
                    <p>Build chart</p>
                </div>

                <div id="fileSelect">
                    <p>Select files:</p>

                    <label className="file">
                        <input
                            type="file"
                            aria-label="File browser"
                            multiple
                            onChange={this.onFilesChange}
                        />
                        <span className="file-custom">
                            {this.state.files.length > 1
                                ? this.state.files.length + " selected"
                                : this.state.files.length === 1
                                ? this.state.files[0].name
                                : "Choose files..."}
                        </span>
                    </label>
                </div>

                <div className="buildDiv">
                    <button
                        className="buildButton"
                        onClick={() =>
                            this.calculate(this.state.files, this.state.sdMode)
                        }
                    >
                        Build charts
                    </button>
                </div>
            </div>
        );
    }
}

export default withFirebase(Calculation);
