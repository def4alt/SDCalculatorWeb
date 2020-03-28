/// <reference path="../../react-vis.d.ts"/>

import React from "react";
import { StatModel, SampleType } from "../../types";
import { XYPlot, YAxis, XAxis, LineMarkSeries, LineSeries } from "react-vis";
import moment from "moment";

import "./line_chart.scss";

interface LineChartProps {
    model: StatModel;
}

interface LineChartState {
    yValues: number[];
}

let Line = (value: number, color: string, repeat: number) => {
    return (
        <LineSeries
            data={[...Array(repeat === 1 ? 2 : repeat)].map((_, i) => ({
                x: i,
                y: value
            }))}
            style={{
                strokeLinejoin: "round",
                strokeWidth: 2
            }}
            strokeStyle="dashed"
            color={color}
        />
    );
};

const yLabels = ["3SD", "2SD", "SD", "M", "SD", "2SD", "3SD"];

class LineChart extends React.Component<LineChartProps, LineChartState> {
    getLevelText = (level: SampleType) =>
        level === SampleType.Lvl1 ? "Lvl1" : "Lvl2";

    constructor(props: LineChartProps) {
        super(props);

        let model = props.model;
        let yValues = [
            model.Average[0] + 3 * model.SD,
            model.Average[0] + 2 * model.SD,
            model.Average[0] + model.SD,
            model.Average[0],
            model.Average[0] - model.SD,
            model.Average[0] - 2 * model.SD,
            model.Average[0] - 3 * model.SD
        ];

        this.state = {
            yValues
        };
    }

    render() {
        let model = this.props.model;

        var data = [...Array(model.Average.length)].map((_, i) => ({
            x: i,
            y: model.Average[i]
        }));

        return (
            <div id="canvas">
                <XYPlot
                    margin={{ left: 90, right: 30, bottom: 50 }}
                    width={
                        250 + 100 * model.Average.length >
                            window.innerWidth - 50 && window.innerWidth !== 0
                            ? window.innerWidth - 80
                            : 250 + 100 * model.Average.length
                    }
                    height={250}
                >
                    <YAxis
                        tickValues={this.state.yValues}
                        style={{
                            display: "inline-flex",
                            fontSize: 12,
                            fontWeight: 100,
                            text: { fill: "#636e72" }
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
                                fontWeight: 100
                            },
                            ticks: {
                                stroke: "none"
                            }
                        }}
                        top={220}
                        tickFormat={(i: number) => model.Warnings[i]}
                    />
                    <XAxis
                        hideLine
                        tickValues={[...Array(model.Average.length).keys()]}
                        tickFormat={(i: number) =>
                            moment(model.Date[i])
                                .format("DD/MM/YY")
                                .toLocaleString()
                        }
                        style={{
                            ticks: {
                                stroke: "none"
                            }
                        }}
                        tickLabelAngle={-20}
                    />

                    <LineMarkSeries
                        data={data}
                        style={{
                            strokeLinejoin: "round",
                            strokeWidth: 4
                        }}
                        color="#d63031"
                    />
                    {Line(
                        model.Average[0] + 3 * model.SD,
                        "#e84393",
                        model.Average.length
                    )}
                    {Line(
                        model.Average[0] + 2 * model.SD,
                        "#00cec9",
                        model.Average.length
                    )}
                    {Line(
                        model.Average[0] + model.SD,
                        "#ff7675",
                        model.Average.length
                    )}
                    {Line(model.Average[0], "#6c5ce7", model.Average.length)}
                    {Line(
                        model.Average[0] - model.SD,
                        "#ff7675",
                        model.Average.length
                    )}
                    {Line(
                        model.Average[0] - 2 * model.SD,
                        "#00cec9",
                        model.Average.length
                    )}
                    {Line(
                        model.Average[0] - 3 * model.SD,
                        "#e84393",
                        model.Average.length
                    )}
                </XYPlot>
            </div>
        );
    }
}

export default LineChart;
