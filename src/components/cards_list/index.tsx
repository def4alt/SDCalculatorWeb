import React from "react";
import { StatModel } from "../../types";
import Card from "../card";

import "./cards_list.scss";

interface CardsListProps {
    models: StatModel[];
}

const CardsList: React.FC<CardsListProps> = props => (
    <div className="cardslist">
        {props.models.map((model: StatModel, i: number) => (
            <Card model={model} key={i} />
        ))}
    </div>
);

export default CardsList;
