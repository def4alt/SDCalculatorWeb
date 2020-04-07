import React, { useEffect, useState, useRef } from "react";
import { StatModel, SampleType } from "../../types";
import LineChart from "../line_chart";

import "../../styles/card/card.scss";

interface CardProps {
    model: StatModel;
    width: number;
}

let getLevelText = (lvl: SampleType) =>
    lvl === SampleType.Lvl1 ? "Lvl1" : "Lvl2";

const Card: React.FC<CardProps> = (props) => {
    const [inView, setInView] = useState<boolean>(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("scroll", scrollHandler);
        setInView(isInView);

        return () => {
            window.removeEventListener("scroll", scrollHandler);
        };
    });

    const isInView = () => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= window.innerWidth;
        }
        return false;
    };

    const scrollHandler = () => setInView(isInView);
    return (
        <div className={"card"} ref={cardRef} style={{ width: props.width }}>
            <p className="card__title">
                {props.model.TestName +
                    " " +
                    getLevelText(props.model.SampleType)}
            </p>
            <div
                className={
                    inView ? "card__chart" : "card__chart card__chart_hidden"
                }
            >
                <LineChart model={props.model} width={props.width} />
            </div>
        </div>
    );
};

export default Card;
