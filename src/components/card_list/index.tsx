import { h } from "preact";
import { useState, useMemo, useContext } from "preact/hooks";
import { ProcessedData } from "src/types/common";
import { LocalizationContext } from "src/context/localization";
import Card from "src/components/card";

interface CardsListProps {
    data: ProcessedData[];
}

const CardsList: React.FC<CardsListProps> = ({ data }) => {
    const [showSDCV, setShowSDCV] = useState<boolean>(true);
    const localization = useContext(LocalizationContext).localization;

    const cards = useMemo(() => {
        return data.map((cardData: ProcessedData, i: number) => (
            <Card data={cardData} showSDCV={showSDCV} key={i} />
        ));
    }, [data, showSDCV]);

    return (
        <div class="w-full px-4 flex flex-col wrap:flex-row wrap:flex-wrap gap-6 print:gap-0 justify-center align-top items-center print:m-0">
            <div class="w-full flex justify-center align-middle items-center print:hidden">
                <button
                    class="bg-gray-100 hover:bg-gray-200 w-1/2 h-10 rounded-md"
                    onClick={() => setShowSDCV(!showSDCV)}
                >
                    {showSDCV ? localization.hide : localization.show} SD / CV
                </button>
            </div>
            {cards}
        </div>
    );
};

export default CardsList;
