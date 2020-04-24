import React, { useEffect, useMemo, useRef, useState } from "react";
import { StatModel } from "../../types";
import { MdAdd, MdClear } from "react-icons/md";
import LineChart from "../line_chart";

import "../../styles/card/card.scss";

interface CardProps {
    model: StatModel;
    width: number;
    showSDCV: boolean;
}

const Card: React.FC<CardProps> = (props) => {
    const [inView, setInView] = useState<boolean>(false);
    const [hideFromPrint, setHideFromPrint] = useState<boolean>(false);

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
        () => props.model.Warnings.filter((t) =>
            t.trim() !== "").length > 0,
        [props.model.Warnings, props.model.Warnings.length]
    );

    useEffect(() => {
        window.addEventListener("scroll", isInView);
        isInView();

        return () => window.removeEventListener("scroll", isInView);
    }, []);

    const cardState = useMemo(() => {
        if (hideFromPrint)
            return "card card_hidden";

        if (hasWarning)
            return "card card_red";

        return "card";
    }, [hideFromPrint, hasWarning]);

    const sd = useMemo(() =>
        Math.floor(props.model.SD * 100) / 100,
        [props.model.SD]);

    const cv = useMemo(() =>
        Math.floor((props.model.SD / props.model.Average[0]) * 100 * 100) / 100,
        [props.model.Average]);

    return (
        <div
            className={cardState}
            ref={cardRef}
            style={{ width: props.width }}
        >
            <div className="card__header">
                <p className="card__title">
                    {props.model.TestName + " Lvl" +
                    String(props.model.SampleType)}
                </p>
                <button className="card__close" onClick={() =>
                    setHideFromPrint(!hideFromPrint)}>{
                    hideFromPrint ?
                        <MdAdd/> : <MdClear/>
                }</button>
            </div>
            <div className={inView ? "card__chart" : "card__chart_hidden"}>
                <LineChart model={props.model} width={props.width}/>
            </div>
            <div className={props.showSDCV ? "card__footer" : "card__footer_hidden"}>
                <p>SD {sd} CV {cv}</p>
            </div>
        </div>
    );
};

export default Card;
