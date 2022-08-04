import React, { useState, useEffect, useContext } from "react";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";
import { LocalizationContext } from "Context/localization";

import "Styles/lot/lot.scss";
import "Styles/edit/edit.scss";
import { ProcessedData } from "src/types";
import { supabase } from "Context/supabase/api";
import { UserContext } from "src/app";

interface LotProps {
    callback: (lot: number, data: ProcessedData[]) => void;
}

const Lot: React.FC<LotProps> = ({ callback }) => {
    const [lotList, setLotList] = useState<number[]>([]);
    const [lot, setLot] = useState<number>(0);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const { localization } = useContext(LocalizationContext);

    const user = useContext(UserContext);

    useEffect(() => {
        supabase
            .from("backups")
            .select("lot")
            .match({ user_id: user?.id })
            .then((response) => {
                if (response.data === null) return;

                const data = response.data.map((t) => t.lot);
                setLotList(data);
            });
    }, [user]);

    const removeLot = async (lot: number) => {
        let newList =
            lotList.filter((t) => t !== lot).length > 0
                ? lotList.filter((t) => t !== lot)
                : [];

        setLotList(newList);

        if (newList.length === 0) selectLot(0);
        else selectLot(newList[newList.length - 1]);

        await supabase
            .from("backups")
            .delete()
            .match({ lot, user_id: user?.id });
    };

    const selectLot = async (lot: number) => {
        setLot(lot);

        const response = await supabase
            .from("backups")
            .select("data")
            .match({ user_id: user?.id, lot })
            .limit(1)
            .single();

        const data = response.data.data;
        if (data !== null) callback(lot, data);
        else callback(lot, []);
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
