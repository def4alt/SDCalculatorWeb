import { h } from "preact";
import { FaCheck, FaPlus, FaTimes } from "react-icons/fa";
import { LocalizationContext } from "src/context/localization";
import { useState, useEffect, useContext } from "preact/hooks";

import "src/styles/lot/lot.scss";
import "src/styles/edit/edit.scss";
import { supabase } from "src/context/supabase/api";
import { UserContext } from "src/app";
import { TargetedEvent } from "preact/compat";

interface LotProps {
    callback: (lot: number) => void;
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

    const selectLot = (lot: number) => {
        setLot(lot);
        callback(lot);
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
                            <FaTimes />
                        </button>
                    </div>
                ))}
                {isAdding ? (
                    <div className="edit__input">
                        <input
                            type="text"
                            onChange={(
                                event: TargetedEvent<HTMLInputElement>
                            ) => (tempLot = event.currentTarget.value)}
                        />
                        <button
                            onClick={() => {
                                setIsAdding(false);
                                addLot(Number(tempLot));
                            }}
                            type="button"
                        >
                            <FaCheck />
                        </button>
                    </div>
                ) : (
                    <button
                        className="edit__add"
                        aria-label="Add lot"
                        onClick={() => setIsAdding(true)}
                    >
                        <FaPlus />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Lot;
