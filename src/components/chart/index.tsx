import { h } from "preact";
import { useMemo } from "preact/hooks";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartOptions,
    CoreScaleOptions,
    Scale,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export const Chart: React.FC<{
    data: {
        values: number[];
        labels: string[];
        average: number;
        sd: number;
    };
}> = ({ data }) => {
    const { values, labels, average, sd } = data;

    const chartData = {
        labels,
        datasets: [
            {
                label: "Value",
                data: values,
                backgroundColor: "#d63031",
                borderColor: "#d63031",
            },
        ],
    };

    const options: ChartOptions<"line"> = useMemo(() => {
        return {
            responsive: true,
            animation: false,
            maintainAspectRatio: false,
            datasets: {
                line: {
                    borderWidth: 4,
                },
            },
            scales: {
                x: {
                    ticks: {
                        minRotation: 0,
                        maxRotation: 90,
                        autoSkip: false,
                        callback(
                            this: Scale<CoreScaleOptions>,
                            tickValue: string | number
                        ) {
                            const value = Number(tickValue);
                            const label = this.getLabelForValue(value); // eslint-disable-line react/no-this-in-sfc
                            return label.split(";")[0];
                        },
                    },
                    grid: {
                        display: false,
                    },
                },
                xAxisViolations: {
                    type: "category",
                    grid: { drawOnChartArea: false },
                    ticks: {
                        callback(
                            this: Scale<CoreScaleOptions>,
                            tickValue: string | number
                        ) {
                            const value = Number(tickValue);
                            const label = this.getLabelForValue(value); // eslint-disable-line react/no-this-in-sfc
                            return label.split(";")[1];
                        },
                        autoSkip: false,
                        color: "#c62828",
                        font: {
                            size: 15,
                        },
                    },
                },
                y: {
                    min: average - 4 * sd,
                    max: average + 4 * sd,
                    ticks: {
                        stepSize: sd,
                        autoSkip: false,
                        callback: (tickValue: string | number) => {
                            const value = Number(tickValue);
                            const tolerance = 0.01;
                            if (Math.abs(value - average) < tolerance) {
                                return Math.floor(value * 100) / 100 + ", M";
                            }
                            return (
                                Math.floor(value * 100) / 100 +
                                ", " +
                                Math.floor(
                                    (Math.abs(value - average) + tolerance) / sd
                                ) +
                                "SD"
                            );
                        },
                    },

                    grid: {
                        drawBorder: false,
                        color: [
                            "#fffff",
                            "#e84393",
                            "#00cec9",
                            "#ff7675",
                            "#6c5ce7",
                            "#ff7675",
                            "#00cec9",
                            "#e84393",
                            "#fffff",
                        ],
                        lineWidth: 1.5,
                        borderDash: [8, 4],
                    },
                },
            },
        };
    }, [average, sd]);

    return <Line options={options} data={chartData} />;
};
