import { h } from "preact";
import { FaCheck, FaPlus, FaTimes } from "react-icons/fa";
import { LocalizationContext } from "src/context/localization";
import { useState, useEffect, useContext } from "preact/hooks";
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
        <div class="w-1/2">
            <div class="mb-4">
                {localization.lots} <span class="text-gray-500">#{lot}</span>
            </div>
            <div class="h-52 border-2 rounded-md p-4 flex flex-wrap flex-col gap-4 justify-start items-start align-top overflow-x-auto">
                {lotList.map((lot, i) => (
                    <div
                        class="h-10 w-32 hover:border-gray-300 flex justify-between align-middle items-center  border-2 rounded-md p-2"
                        key={i}
                    >
                        <button
                            class="text-lg w-full text-left"
                            onClick={() => selectLot(lot)}
                        >
                            {lot}
                        </button>
                        <button
                            class="text-gray-500 hover:text-gray-600"
                            onClick={() => removeLot(lot)}
                        >
                            <FaTimes />
                        </button>
                    </div>
                ))}
                {isAdding ? (
                    <div class="h-10 w-32 flex justify-around align-middle items-center p-2 border-2 rounded-md">
                        <input
                            type="text"
                            class="w-full h-full rounded-md mr-4 border-2"
                            onChange={(
                                event: TargetedEvent<HTMLInputElement>
                            ) => (tempLot = event.currentTarget.value)}
                        />
                        <button
                            onClick={() => {
                                setIsAdding(false);
                                addLot(Number(tempLot));
                            }}
                            class="text-gray-500 hover:text-gray-600"
                            type="button"
                        >
                            <FaCheck />
                        </button>
                    </div>
                ) : (
                    <button
                        class="h-10 hover:border-gray-300  w-32 flex justify-around text-gray-500 hover:text-gray-600 align-middle items-center  border-2 rounded-md"
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
