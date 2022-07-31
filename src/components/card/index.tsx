import React, { useMemo, useRef, useState } from "react";
import { StatModel } from "../../types";
import { MdAdd, MdClear } from "react-icons/md";
import { Chart } from "Components/chart";

import "Styles/card/card.scss";
import moment from "moment";

interface CardProps {
    model: StatModel;
    showSDCV: boolean;
}

const Card: React.FC<CardProps> = (props) => {
    const [hideFromPrint, setHideFromPrint] = useState<boolean>(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const model = props.model;

    const hasWarning = useMemo(
        () => model.Warnings.filter((t) => t.trim() !== "").length > 0,
        [model.Warnings, props.model.Warnings.length]
    );

    const cardState = useMemo(() => {
        if (hideFromPrint) return "card card_hidden";

        if (hasWarning) return "card card_red";

        return "card";
    }, [hideFromPrint, hasWarning]);

    const sd = useMemo(() => Math.floor(model.SD * 100) / 100, [model.SD]);

    const cv = useMemo(
        () => Math.floor((model.SD / model.Average[0]) * 100 * 100) / 100,
        [model.Average]
    );

    const labels = useMemo(
        () =>
            [...Array(model.Average.length)].map(
                (_, i) =>
                    moment(model.Date.at(i))
                        .format("DD/MM/YY")
                        .toLocaleString() +
                    ";" +
                    model.Warnings.at(i)
            ),
        [model.Average.length, model.Warnings]
    );

    const data = useMemo(() => {
        return {
            values: model.Average,
            average: model.Average[0],
            sd: model.SD,
            labels,
        };
    }, [model.Average.length, model.SD, labels.length]);

    return (
        <div className={cardState} ref={cardRef}>
            <div className="card__header">
                <p className="card__title">
                    {model.TestName + " Lvl" + String(model.SampleType)}
                </p>
                <button
                    className="card__close"
                    onClick={() => setHideFromPrint(!hideFromPrint)}
                >
                    {hideFromPrint ? <MdAdd /> : <MdClear />}
                </button>
            </div>
            <div className="card__chart">
                <Chart data={data} />
            </div>
            <div
                className={
                    props.showSDCV ? "card__footer" : "card__footer_hidden"
                }
            >
                <p>
                    SD {sd} CV {cv}
                </p>
            </div>
        </div>
    );
};

export default Card;
