export const checkWestgardViolations = (
    values: number[],
    average: number,
    sd: number
) => {
    // If two consecutive numbers exceed 2S
    // if difference between two consecutive numbers is greater/equal to 3S
    // if one of the two consecutive numbers is over 2S and other is lower than -2S
    // if four consecutive numbers are greater than 1S
    // if eight consecutive numbers form a trend

    const violations: string[] = [];

    let plusSdCounter = 0;
    let minusSdCounter = 0;
    let plusTrendCounter = 0;
    let minusTrendCounter = 0;
    let previousValue = values[0];

    values.forEach((value) => {
        if (value >= average + sd) {
            minusSdCounter = 0;
            plusSdCounter++;
        } else if (value <= average - sd) {
            plusSdCounter = 0;
            minusSdCounter++;
        }

        if (value >= previousValue) {
            minusTrendCounter = 0;
            plusTrendCounter++;
        } else if (value <= previousValue) {
            plusTrendCounter = 0;
            minusTrendCounter++;
        }

        if (plusTrendCounter === 8 || minusTrendCounter === 8) {
            plusTrendCounter = 0;
            minusTrendCounter = 0;
            violations.push("8X");
            previousValue = value;
            return;
        }

        if (plusSdCounter === 4 || minusSdCounter === 4) {
            minusSdCounter = 0;
            plusSdCounter = 0;
            violations.push("41S");
            previousValue = value;
            return;
        }

        if (
            (value > average + 2 * sd && previousValue < average - 2 * sd) ||
            (value < average - 2 * sd && previousValue > average + 2 * sd)
        ) {
            violations.push("R4S");
            previousValue = value;
            return;
        }

        if (
            Math.abs(value - average) > 2 * sd &&
            Math.abs(previousValue - average) > 2 * sd
        ) {
            violations.push("22S");
            previousValue = value;
            return;
        }

        if (Math.abs(value - average) > 3 * sd) {
            violations.push("13S");
            previousValue = value;
            return;
        }

        violations.push("");
        previousValue = value;
    });

    violations.pop();

    return violations;
};
