import React, { useEffect, useState, useRef, useMemo } from "react";
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
        const card = cardRef.current;

        if (!card) return false;

        const rect = card.getBoundingClientRect();

        setInView(
            rect.top >= -300 &&
                rect.bottom <=
                    (window.innerHeight + 300 ||
                        document.documentElement.clientHeight + 300)
        );
    };

    const hasWarning = useMemo(
        () => props.model.Warnings.filter((t) => t.trim() !== "").length > 0,
        [props.model.Warnings, props.model.Warnings.length]
    );

    useEffect(() => {
        isInView();
        window.addEventListener("scroll", isInView);

        return () => window.removeEventListener("scroll", isInView);
    }, []);

    return (
        <div
            className={hasWarning ? "card_red" : "card"}
            ref={cardRef}
            style={{ width: props.width }}
        >
            <p className="card__title">
                {props.model.TestName +
                    " " +
                    getLevelText(props.model.SampleType)}
            </p>
            <div className="card__chart">
                {inView && (
                    <LineChart model={props.model} width={props.width} />
                )}
            </div>
        </div>
    );
};

export default Card;
