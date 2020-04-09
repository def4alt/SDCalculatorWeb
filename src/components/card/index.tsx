import React, { useEffect, useState, useRef } from "react";
import { StatModel, SampleType } from "../../types";
import LineChart from "../line_chart";

import "../../styles/card/card.scss";

interface CardProps {
    model: StatModel;
    width: number;
}

const getLevelText = (lvl: SampleType) =>
    lvl === SampleType.Lvl1 ? "Lvl1" : "Lvl2";

const Card: React.FC<CardProps> = (props) => {
    const [inView, setInView] = useState<boolean>(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const isInView = () => {
        let card = cardRef.current;

        if (!card) return false;

        var rect = card.getBoundingClientRect();

        return (
            rect.top >= -300 &&
            rect.bottom <=
                (window.innerHeight + 300 ||
                    document.documentElement.clientHeight + 300)
        );
    };

    useEffect(() => {
        setInView(isInView);
        window.addEventListener("scroll", () => setInView(isInView));

        return () => {
            window.removeEventListener("scroll", () => setInView(isInView));
        };
    }, []);

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
