import { h } from "preact";
import { useState, useMemo, useContext } from "preact/hooks";
import { ProcessedData } from "../../types";
import { LocalizationContext } from "src/context/localization";

import "src/styles/card-list/card-list.scss";
import "src/styles/button/button.scss";
import Card from "../card";

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
        <div className="card-list">
            <div className="card-list__header">
                <button
                    className="button_link"
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
