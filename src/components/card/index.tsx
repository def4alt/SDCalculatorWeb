import { h } from "preact";
import { useState, useRef, useMemo } from "preact/hooks";
import { ProcessedData } from "../../types";
import { FaPlus, FaTimes } from "react-icons/fa";
import { Chart } from "src/components/chart";

import "src/styles/card/card.scss";
import moment from "moment";

interface CardProps {
    data: ProcessedData;
    showSDCV: boolean;
}

const Card: React.FC<CardProps> = ({ data, showSDCV }) => {
    const [hideFromPrint, setHideFromPrint] = useState<boolean>(false);

    const cardRef = useRef<HTMLDivElement>(null);

    const hasWarning = useMemo(
        () => data.Warnings.filter((t) => t.trim() !== "").length > 0,
        [data.Warnings, data.Warnings.length]
    );

    const cardState = useMemo(() => {
        if (hideFromPrint) return "card card_hidden";

        if (hasWarning) return "card card_red";

        return "card";
    }, [hideFromPrint, hasWarning]);

    const sd = useMemo(() => Math.floor(data.SD * 100) / 100, [data.SD]);

    const cv = useMemo(
        () => Math.floor((data.SD / data.Values[0]) * 100 * 100) / 100,
        [data.Values]
    );

    const labels = useMemo(
        () =>
            [...Array(data.Values.length)].map(
                (_, i) =>
                    moment(data.Dates.at(i))
                        .format("DD/MM/YY")
                        .toLocaleString() +
                    ";" +
                    data.Warnings.at(i)
            ),
        [data.Values.length, data.Warnings]
    );

    const chartData = useMemo(() => {
        return {
            values: data.Values,
            average: data.Values[0],
            sd: data.SD,
            labels,
        };
    }, [data.Values.length, data.SD, labels.length]);

    return (
        <div className={cardState} ref={cardRef}>
            <div className="card__header">
                <p className="card__title">
                    {data.TestName + " Lvl" + String(data.SampleType)}
                </p>
                <button
                    className="card__close"
                    onClick={() => setHideFromPrint(!hideFromPrint)}
                >
                    {hideFromPrint ? <FaPlus /> : <FaTimes />}
                </button>
            </div>
            <div className="card__chart">
                <Chart data={chartData} />
            </div>
            <div className={showSDCV ? "card__footer" : "card__footer_hidden"}>
                <p>
                    SD {sd} CV {cv}
                </p>
            </div>
        </div>
    );
};

export default Card;
