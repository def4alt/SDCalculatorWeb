/// <reference path="../../react-vis.d.ts"/>

import React, { useMemo } from "react";
import { StatModel } from "../../types";
import { LineMarkSeries, LineSeries, XAxis, XYPlot, YAxis } from "react-vis";
import moment from "moment";

import "Styles/line-chart/line-chart.scss";

interface LineChartProps {
    model: StatModel;
    width: number;
}

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
                x: i,
                y: model.Average[i],
            })),
        [model.Average, model.Average.length]
    );

    const Line = (value: number, color: string, repeat: number) => {
        return (
            <LineSeries
                data={[...Array(repeat === 1 ? 2 : repeat)].map((_, i) => ({
                    x: i,
                    y: value,
                }))}
                style={{
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                }}
                strokeStyle="dashed"
                color={color}
            />
        );
    };

    const dateFormat = (index: number) => {
        if (props.width < model.Date.length * 50 - 150)
            if (index == 0 || model.Warnings[index].trim() != "")
                return moment(model.Date[index])
                    .format("DD/MM/YY")
                    .toLocaleString();
            else return "";
        else
            return moment(model.Date[index])
                .format("DD/MM/YY")
                .toLocaleString();
    };

    return (
        <XYPlot
            margin={{ left: 90, right: 30, bottom: 50 }}
            className="line-chart"
            width={props.width}
            height={250}
        >
            <YAxis
                tickValues={yValues}
                style={{
                    display: "inline-flex",
                    fontSize: 12,
                    fontWeight: 100,
                    text: { fill: "#636e72" },
                }}
                tickFormat={(v: number, i: number) =>
                    Math.round(v * 100) / 100 + `, ${yLabels[i]}`
                }
            />

            <XAxis
                hideLine
                orientation="bottom"
                tickValues={[...Array(model.Average.length).keys()]}
                style={{
                    fontSize: 15,
                    text: {
                        stroke: "none",
                        fill: "#c62828",
                        fontWeight: 100,
                    },
                    line: {
                        stroke: "none",
                        fill: "#ffffff",
                    },
                }}
                top={220}
                tickFormat={(i: number) => model.Warnings[i]}
                tickTotal={[...Array(model.Average.length).keys()].length}
            />
            <XAxis
                hideLine
                tickValues={[...Array(model.Average.length).keys()]}
                tickTotal={[...Array(model.Average.length).keys()].length}
                tickFormat={(i: number) => dateFormat(i)}
                style={{
                    ticks: {
                        stroke: "none",
                    },
                    line: {
                        stroke: "none",
                        fill: "#ffffff",
                    },
                }}
                tickLabelAngle={-20}
            />

            {Line(yValues[0], "#e84393", model.Average.length)}
            {Line(yValues[1], "#00cec9", model.Average.length)}
            {Line(yValues[2], "#ff7675", model.Average.length)}
            {Line(yValues[3], "#6c5ce7", model.Average.length)}
            {Line(yValues[4], "#ff7675", model.Average.length)}
            {Line(yValues[5], "#00cec9", model.Average.length)}
            {Line(yValues[6], "#e84393", model.Average.length)}
            <LineMarkSeries
                data={data}
                style={{
                    strokeLinejoin: "round",
                    strokeWidth: 4,
                }}
                color="#d63031"
            />
        </XYPlot>
    );
};

export default LineChart;
