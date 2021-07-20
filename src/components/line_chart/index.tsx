import React, { FunctionComponent, useMemo } from "react";
import { StatModel } from "../../types";
import {
    Line,
    LineChart as ReLineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import moment from "moment";

import "Styles/line-chart/line-chart.scss";

interface LineChartProps {
    model: StatModel;
}

const DateAxisTick: FunctionComponent<any> = (props: any) => {
    const { x, y, payload } = props;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="end"
                fill="#666"
                fontSize={12}
                fontWeight={100}
                fontFamily="Roboto"
                transform="rotate(-25)"
            >
                {payload.value}
            </text>
        </g>
    );
};

const WarningAxisTick: FunctionComponent<any> = (props: any) => {
    const { x, y, payload } = props;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={32}
                dx={14}
                textAnchor="end"
                fill="#d63031"
                fontSize={16}
                fontWeight={100}
                fontFamily="Roboto"
            >
                {payload.value}
            </text>
        </g>
    );
};

const yLabels = ["3SD", "2SD", "SD", "M", "SD", "2SD", "3SD"];

const LineChart: React.FunctionComponent<LineChartProps> = (props) => {
    const model = props.model;

    const yValues = useMemo(
        () => [
            model.Average[0] + 3 * model.SD,
            model.Average[0] + 2 * model.SD,
            model.Average[0] + model.SD,
            model.Average[0],
            model.Average[0] - model.SD,
            model.Average[0] - 2 * model.SD,
            model.Average[0] - 3 * model.SD,
        ],
        [model.Average, model.SD]
    );

    const data = useMemo(
        () =>
            [...Array(model.Average.length)].map((_, i) => ({
                avPlus3SD: model.Average[0] + 3 * model.SD,
                avPlus2SD: model.Average[0] + 2 * model.SD,
                avPlusSD: model.Average[0] + model.SD,
                av: model.Average[0],
                avMinusSD: model.Average[0] - model.SD,
                avMinus2SD: model.Average[0] - 2 * model.SD,
                avMinus3SD: model.Average[0] - 3 * model.SD,
                currentAv: model.Average[i],
                date: moment(model.Date[i]).format("DD/MM/YY").toLocaleString(),
                warning: model.Warnings[i],
            })),
        [model.Average, model.Average.length]
    );

    const LineTemplate = (dataKey: string, color: string) => {
        return (
            <Line
                dataKey={dataKey}
                type="monotone"
                strokeDasharray="5 5"
                xAxisId="datesAxis"
                isAnimationActive={false}
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                dot={false}
            />
        );
    };

    return (
        <ResponsiveContainer height={250} width="100%">
            <ReLineChart
                margin={{ top: 5, right: 30, left: 0, bottom: 30 }}
                className="line-chart"
                data={data}
            >
                <YAxis
                    fontWeight={100}
                    fontSize={12}
                    type="number"
                    fill="#636e72"
                    width={100}
                    domain={[
                        model.Average[0] - 3 * model.SD,
                        model.Average[0] + 3 * model.SD,
                    ]}
                    tickFormatter={(v: number, i: number) =>
                        `${Math.floor(v * 100) / 100}, ${yLabels[i]}`
                    }
                    tickCount={7}
                    ticks={yValues}
                    interval={0}
                />

                <XAxis
                    tickLine={false}
                    axisLine={false}
                    dataKey="warning"
                    interval={0}
                    tick={<WarningAxisTick />}
                />
                <XAxis
                    tickLine={false}
                    axisLine={false}
                    xAxisId="datesAxis"
                    interval={0}
                    dataKey="date"
                    tick={<DateAxisTick />}
                />

                {LineTemplate("avPlus3SD", "#e84393")}
                {LineTemplate("avPlus2SD", "#00cec9")}
                {LineTemplate("avPlusSD", "#ff7675")}
                {LineTemplate("av", "#6c5ce7")}
                {LineTemplate("avMinusSD", "#ff7675")}
                {LineTemplate("avMinus2SD", "#00cec9")}
                {LineTemplate("avMinus3SD", "#e84393")}
                <Line
                    isAnimationActive={false}
                    dataKey="currentAv"
                    xAxisId="datesAxis"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    stroke="#d63031"
                />
            </ReLineChart>
        </ResponsiveContainer>
    );
};

export default LineChart;
