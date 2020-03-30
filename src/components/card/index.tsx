import React from "react";
import { StatModel, SampleType } from "../../types";
import LineChart from "../line_chart";

import "./card.scss";

interface CardProps {
    model: StatModel;
    width: number;
}

let getLevelText = (lvl: SampleType) =>
    lvl === SampleType.Lvl1 ? "Lvl1" : "Lvl2";

const Card: React.FC<CardProps> = props => (
    <div
        className="card"
        style={{
            width: props.width
        }}
    >
        <p className="card_title">
            {props.model.TestName + " " + getLevelText(props.model.SampleType)}
        </p>
        <div className="card_image">
            <LineChart model={props.model} width={props.width}/>
        </div>
    </div>
);

export default Card;
