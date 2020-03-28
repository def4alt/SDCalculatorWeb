import React from "react";

import "./calculation.scss";
import Calculate from "./reader";
import { StatModel } from "../../types";
import Firebase, { withFirebase } from "../../context/firebase";
import { FiX, FiPlus, FiCheck } from "react-icons/fi";

interface CalculationProps {
    models: StatModel[];
    firebase: Firebase;
    callback: (lot: number, models: StatModel[]) => void;
}

interface CalculationState {
    sdMode: boolean;
    files: File[];
    lotList: number[];
    lot: number;
    addLot: boolean;
}

class Calculation extends React.Component<CalculationProps, CalculationState> {
    authStateListener?: EventListener;

    constructor(props: CalculationProps) {
        super(props);

        this.state = {
            sdMode: true,
            lot: 0,
            files: [],
            lotList: [],
            addLot: false
        };

        this.onSdModeChange = this.onSdModeChange.bind(this);
        this.onFilesChange = this.onFilesChange.bind(this);
        this.onAuthStateChange = this.onAuthStateChange.bind(this);
    }

    componentDidMount() {
        this.authStateListener = this.props.firebase.auth.onAuthStateChanged(
            this.onAuthStateChange
        );
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
    onAuthStateChange = (user: firebase.User | null) => {
        if (user === null) return;

        const backups = this.props.firebase.backup(user.uid);

        backups.once("value", (snapshot: any) => {
            const backupsObject = snapshot.val();

            if (!backupsObject) return;

            let lotList: number[] = Array.from(
                Object.keys(backupsObject)
                    .filter(j => j !== "isDark" && j !== "details")
                    .values()
            ).map(t => Number(t));

            this.setState({ lotList });
        });
    };

    // Custom functions
    async calculate(files: File[], sdMode: boolean) {
        await Calculate(files, this.props.models, sdMode).then(models =>
            this.props.callback(this.state.lot, models)
        );
    }
    removeLot = (lot: number) => {
        if (this.props.firebase.auth.currentUser === null) return;

        const backups = this.props.firebase.backup(
            this.props.firebase.auth.currentUser.uid
        );

        backups.on("value", (snapshot: any) => {
            snapshot.child(String(lot)).ref.remove();
        });

        this.setState({ lotList: this.state.lotList.filter(t => t !== lot) });
    };
    selectLot = (lot: number) => {
        this.setState({ lot });
    };
    addLot = (lot: number) => {
        this.setState({ lotList: this.state.lotList.concat(lot) });
    };

    render() {
        let tempLot = "";
        return (
            <div className="calculation">
                <div id="lot">
                    <div className="lotView">
                        Lot <span className="lotNumber">#{this.state.lot}</span>
                    </div>
                    <div className="lotEdit">
                        {this.state.lotList.map((lot, i) => (
                            <div className="lotCell" key={i}>
                                <button
                                    className="lotSelect"
                                    onClick={() => this.selectLot(lot)}
                                >
                                    {lot}
                                </button>
                                <button
                                    className="lotRemove"
                                    onClick={() => this.removeLot(lot)}
                                >
                                    <FiX />
                                </button>
                            </div>
                        ))}
                        {this.state.addLot ? (
                            <div className="inputLot">
                                <input
                                    type="text"
                                    onChange={(
                                        event: React.FormEvent<HTMLInputElement>
                                    ) => (tempLot = event.currentTarget.value)}
                                />
                                <button
                                    onClick={() => {
                                        this.setState({ addLot: false });
                                        this.addLot(Number(tempLot));
                                    }}
                                    type="button"
                                >
                                    <FiCheck />
                                </button>
                            </div>
                        ) : (
                            <button
                                className="addLot"
                                onClick={() => this.setState({ addLot: true })}
                            >
                                <FiPlus />
                            </button>
                        )}
                    </div>
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
                        <span className="file-custom">Choose files...</span>
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
