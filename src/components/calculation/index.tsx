import React from "react";

import "./calculation.scss";
import Calculate from "./reader";
import { StatModel } from "../../types";

interface CalculationProps {
    models: StatModel[];
    callback: (lot: number, models: StatModel[]) => void;
}

interface CalculationState {
    sdMode: boolean;
    files: File[];
    lot: number;
}

class Calculation extends React.Component<CalculationProps, CalculationState> {
    componentWillMount() {
        this.setState({
            sdMode: true,
            lot: 0,
            files: []
        });

        this.handleSdModeChange = this.handleSdModeChange.bind(this);
        this.handleFilesChange = this.handleFilesChange.bind(this);
    }

    // Handlers
    handleSdModeChange = () => {
        this.setState({
            sdMode: !this.state.sdMode
        });
    };
    handleFilesChange = (event: React.FormEvent<HTMLInputElement>) => {
        let fileArray: File[] = [];

        const fileList: FileList = (event.currentTarget as HTMLInputElement)
            .files as FileList;

        for (let i = 0; i < fileList.length; i++) {
            fileArray.push(fileList[i]);
        }

        this.setState({ files: fileArray });
    };

    // Custom functions
    calculate = () => {
        Calculate(
            this.state.files,
            this.props.models,
            this.state.sdMode
        ).then(models => this.props.callback(this.state.lot, models));
    };

    render() {
        return (
            <div className="calculation">
                <p id="lot">
                    Lot <span id="lotNumber">#{this.state.lot}</span>
                </p>

                <div id="modeSelect">
                    <p>Add average</p>
                    <div className="toggle-button-cover">
                        <div className="button-cover">
                            <div className="button r" id="button-3">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={this.state.sdMode}
                                    onChange={this.handleSdModeChange}
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
                            onChange={this.handleFilesChange}
                        />
                        <span className="file-custom">Choose files...</span>
                    </label>
                </div>

                <div className="buildDiv">
                    <button className="buildButton" onClick={this.calculate}>
                        Build charts
                    </button>
                </div>
            </div>
        );
    }
}

export default Calculation;
