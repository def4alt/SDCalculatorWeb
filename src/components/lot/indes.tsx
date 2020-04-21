import React, { useState, useEffect, useContext } from "react";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";
import Firebase, { FirebaseContext } from "../../context/firebase";
import { AuthUserContext } from "../../context/session";
import { LocalizationContext } from "../../context/localization";

import "../../styles/lot/lot.scss";
import "../../styles/edit/edit.scss";

interface LotProps {
    callback: (lot: number) => void;
}

const Lot: React.FC<LotProps> = (props) => {
    const [lot, setLot] = useState<number>(0);
    const [lotList, setLotList] = useState<number[]>([]);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const firebase = useContext(FirebaseContext) as Firebase;
    const user = useContext(AuthUserContext) as firebase.User;
    const localization = useContext(LocalizationContext).localization;

    useEffect(() => {
        if (!user) {
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
                    snapshot.docs.map((t) => {
                        if (t.id !== "notes") return Number(t.id);
                    }) as number[]
                );
            });
    }, [firebase, user]);

    const removeLot = async (lot: number) => {
        let newList =
            lotList.filter((t) => t !== lot).length > 0
                ? lotList.filter((t) => t !== lot)
                : [];

        setLotList(newList);

        if (newList.length === 0) props.callback(0);
        else props.callback(newList[newList.length - 1]);

        if (!user) return;

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
        setLot(lot);
    };

    let tempLot = "";
    return (
        <>
            <div className="lot__view">
                {localization.lots}{" "}
                <span className="lot__view_gray">#{lot}</span>
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
                        onClick={() => setIsAdding(true)}
                    >
                        <FiPlus />
                    </button>
                )}
            </div>
        </>
    );
};

export default Lot;
