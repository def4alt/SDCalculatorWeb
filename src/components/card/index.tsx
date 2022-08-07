import { h } from "preact";
import { useState, useMemo } from "preact/hooks";
import { ProcessedData } from "src/types/common";
import { FaPlus, FaTimes } from "react-icons/fa";
import { Chart } from "src/components/chart";
import moment from "moment";

interface CardProps {
    data: ProcessedData;
    showSDCV: boolean;
}

const Card: React.FC<CardProps> = ({ data, showSDCV }) => {
    const [hideFromPrint, setHideFromPrint] = useState<boolean>(false);

    const hasWarning = useMemo(
        () => data.Warnings.filter((t) => t.trim() !== "").length > 0,
        [data.Warnings, data.Warnings.length]
    );

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
        <div
            class={`w-full md:w-9/12 wrap:w-5/12 h-80 border-2 bg-white rounded-md flex flex-col print:my-6 justify-center align-middle items-center print:h-[calc((100vh/3)-3rem)] even:break-before-all ${
                hasWarning ? "border-red-500" : ""
            } ${
                hideFromPrint
                    ? "border-yellow-500 border-dashed border-spacing-4 print:hidden"
                    : ""
            }`}
        >
            <div class="w-full flex justify-center align-middle items-center h-20">
                <div class="basis-10"></div>
                <p class="flex-grow text-center text-lg">
                    {data.TestName + " Lvl" + String(data.SampleType)}
                </p>
                <button
                    class="basis-10 print:invisible"
                    onClick={() => setHideFromPrint(!hideFromPrint)}
                >
                    {hideFromPrint ? <FaPlus /> : <FaTimes />}
                </button>
            </div>
            <div class="w-full h-full px-4 flex justify-center align-middle items-center">
                <Chart data={chartData} />
            </div>
            <p class="mb-4 text-sm text-gray-500 h-8">
                {showSDCV ? `SD ${sd} CV ${cv}` : ""}
            </p>
        </div>
    );
};

export default Card;
