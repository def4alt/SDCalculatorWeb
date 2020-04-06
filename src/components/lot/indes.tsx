import React from "react";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";
import Firebase, { withFirebase } from "../../context/firebase";

import "../../styles/lot/lot.scss";
import "../../styles/edit/edit.scss";

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
            addLot: false,
        };

        this.onAuthStateChange = this.onAuthStateChange.bind(this);
    }

    componentDidMount() {
        this.authStateListener = this.props.firebase.auth.onAuthStateChanged(
            this.onAuthStateChange
        );
    }

    onAuthStateChange = async (user: firebase.User | null) => {
        if (user === null) return;

        await this.props.firebase
            .backup(user.uid)
            .collection("lots")
            .get()
            .then((snapshot) => {
                let lotList = snapshot.docs.map((t) => {
                    if (t.id !== "notes") return Number(t.id);
                }) as number[];
                this.setState({ lotList });
            });
    };

    removeLot = async (lot: number) => {
        let newList =
            this.state.lotList.filter((t) => t !== lot).length > 0
                ? this.state.lotList.filter((t) => t !== lot)
                : [];

        this.setState({ lotList: newList });

        if (newList.length === 0) {
            this.props.callback(0);
        }

        if (!this.props.firebase.auth.currentUser) return;

        await this.props.firebase
            .backup(this.props.firebase.auth.currentUser.uid)
            .collection("lots")
            .doc(String(lot))
            .delete();
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
                <div className="lot__view">
                    Lots{" "}
                    <span className="lot__view_gray">#{this.state.lot}</span>
                </div>
                <div className="edit">
                    {this.state.lotList.map((lot, i) => (
                        <div className="edit__cell" key={i}>
                            <button
                                className="edit__select"
                                onClick={() => this.selectLot(lot)}
                            >
                                {lot}
                            </button>
                            <button
                                className="edit__remove"
                                onClick={() => this.removeLot(lot)}
                            >
                                <FiX />
                            </button>
                        </div>
                    ))}
                    {this.state.addLot ? (
                        <div className="edit__input">
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
                            className="edit__add"
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
