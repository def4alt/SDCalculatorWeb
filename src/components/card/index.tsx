import React from "react";
import { StatModel, SampleType } from "../../types";
import LineChart from "../line_chart";

import "./card.scss";

interface CardProps {
    model: StatModel;
}

let getLevelText = (lvl: SampleType) =>
    lvl === SampleType.Lvl1 ? "Lvl1" : "Lvl2";

const Card: React.FC<CardProps> = props => (
    <div
        className="card"
        style={{
            width:
                250 + 100 * props.model.Average.length > window.innerWidth - 50 &&
                window.innerWidth !== 0
                    ? window.innerWidth - 80
                    : 250 + 100 * props.model.Average.length
        }}
    >
        <p className="card_title">
            {props.model.TestName + " " + getLevelText(props.model.SampleType)}
        </p>
        <div className="card_image">
            <LineChart model={props.model} />
        </div>
    </div>
);

export default Card;
