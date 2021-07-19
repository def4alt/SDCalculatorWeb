import React, { useState, useEffect, useContext } from "react";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";
import { FirebaseContext } from "Context/firebase";
import { AuthUserContext } from "Context/session";
import { LocalizationContext } from "Context/localization";
import firebase from "firebase";

import "Styles/lot/lot.scss";
import "Styles/edit/edit.scss";

interface LotProps {
    callback: (lot: number) => void;
}

const Lot: React.FC<LotProps> = (props) => {
    const [lot, setLot] = useState<number>(0);
    const [lotList, setLotList] = useState<number[]>([]);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const firebase = useContext(FirebaseContext);
    const user = useContext(AuthUserContext);
    const localization = useContext(LocalizationContext).localization;

    useEffect(() => {
        if (!firebase) return;

        const unsubscribe = firebase.auth.onAuthStateChanged(
            authStateChangeHandler
        );

        return () => unsubscribe();
    }, [firebase, firebase?.user]);

    const authStateChangeHandler = (user: firebase.User | null) => {
        if (!user || !firebase) {
            setLotList([]);
            setLot(0);
            return;
        }

        firebase
            .backup(user.uid)
            .collection("lots")
            .get()
            .then((snapshot) => {
                setLotList(
                    snapshot.docs
                        .filter((t) => t.id !== "notes")
                        .map((t) => Number(t.id))
                );
            });
    };

    const removeLot = async (lot: number) => {
        let newList =
            lotList.filter((t) => t !== lot).length > 0
                ? lotList.filter((t) => t !== lot)
                : [];

        setLotList(newList);

        if (newList.length === 0) selectLot(0);
        else selectLot(newList[newList.length - 1]);

        if (!user || !firebase) return;

        await firebase
            .backup(user.uid)
            .collection("lots")
            .doc(String(lot))
            .delete();
    };
    const selectLot = (lot: number) => {
        setLot(lot);
        props.callback(lot);
    };
    const addLot = (lot: number) => {
        if (isNaN(lot)) return;
        setLotList(lotList.concat(lot));
        selectLot(lot);
    };

    let tempLot = "";
    return (
        <div className="calculation__lot">
            <div className="calculation__lot-view">
                {localization.lots} <span className="text_gray">#{lot}</span>
            </div>
            <div className="edit">
                {lotList.map((lot, i) => (
                    <div className="edit__cell" key={i}>
                        <button
                            className="edit__select"
                            onClick={() => selectLot(lot)}
                        >
                            {lot}
                        </button>
                        <button
                            className="edit__remove"
                            onClick={() => removeLot(lot)}
                        >
                            <FiX />
                        </button>
                    </div>
                ))}
                {isAdding ? (
                    <div className="edit__input">
                        <input
                            type="text"
                            onChange={(
                                event: React.FormEvent<HTMLInputElement>
                            ) => (tempLot = event.currentTarget.value)}
                        />
                        <button
                            onClick={() => {
                                setIsAdding(false);
                                addLot(Number(tempLot));
                            }}
                            type="button"
                        >
                            <FiCheck />
                        </button>
                    </div>
                ) : (
                    <button
                        className="edit__add"
                        aria-label="Add lot"
                        onClick={() => setIsAdding(true)}
                    >
                        <FiPlus />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Lot;
