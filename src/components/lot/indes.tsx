import React from "react";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";
import Firebase, { withFirebase } from "../../context/firebase";

import "./lot.scss";

interface LotProps {
    callback: (lot: number) => void;
    firebase: Firebase;
}

interface LotState {
    lot: number;
    lotList: number[];
    addLot: boolean;
}

class Lot extends React.Component<LotProps, LotState> {
    authStateListener?: EventListener;

    constructor(props: LotProps) {
        super(props);

        this.state = {
            lot: 0,
            lotList: [],
            addLot: false
        };

        this.onAuthStateChange = this.onAuthStateChange.bind(this);
    }

    componentDidMount() {
        this.authStateListener = this.props.firebase.auth.onAuthStateChanged(
            this.onAuthStateChange
        );
    }

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

    removeLot = (lot: number) => {
        let newList =
            this.state.lotList.filter(t => t !== lot).length > 0
                ? this.state.lotList.filter(t => t !== lot)
                : [];

        this.setState({ lotList: newList });

        if (newList.length === 0) {
            this.props.callback(0);
        }

        if (this.props.firebase.auth.currentUser === null) return;

        const backups = this.props.firebase.backup(
            this.props.firebase.auth.currentUser.uid
        );

        backups.on("value", (snapshot: any) => {
            if (!snapshot.child(String(lot)).ref) return;
            snapshot.child(String(lot)).ref.remove();
        });
    };
    selectLot = (lot: number) => {
        this.setState({ lot });
        this.props.callback(lot);
    };
    addLot = (lot: number) => {
        if (isNaN(lot)) return;

        this.setState({ lotList: this.state.lotList.concat(lot) });
    };

    render() {
        let tempLot = "";
        return (
            <div className="lot">
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
                                ) =>
                                    (tempLot = 
                                        event.currentTarget.value
                                    )
                                }
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
        );
    }
}

export default withFirebase(Lot);
