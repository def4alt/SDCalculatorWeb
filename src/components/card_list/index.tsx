import React, { Suspense, useContext, useMemo, useState } from "react";
import { ProcessedData } from "../../types";
import Loading from "Components/loading";
import { LocalizationContext } from "Context/localization";

import "Styles/card-list/card-list.scss";
import "Styles/button/button.scss";

const Card = React.lazy(() => import("Components/card"));

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
            <Suspense fallback={<Loading />}>{cards}</Suspense>
        </div>
    );
};

export default CardsList;
