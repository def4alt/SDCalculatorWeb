export default function CheckValues(averageValues: number[], SD: number) {

    for (let i = 1; i < averageValues.length; i++) {
        if (averageValues.length - i >= 8) {
            if (Rule8X(i, averageValues)) return "8X";
        } else if (averageValues.length - i >= 4) {
            if (Rule41S(i, averageValues, SD)) return "41S";
        } else if (averageValues.length - i >= 2) {
            if (Rule22S(i, averageValues, SD)) return "22S";
            else if (RuleR4S(i, averageValues, SD)) return "R4S";
        } else if (Rule13S(i, averageValues, SD)) return "13S";
    }

    return " ";
}

const isValueExceedsPlus = (value: number, averageValues: number[], SD: number) => {
    return value > averageValues[0] + 2 * SD;
};

const isValueExceedsMinus = (value: number, averageValues: number[], SD: number) => {
    return value < averageValues[0] - 2 * SD;
};

function Rule22S(index: number, averageValues: number[], SD: number) {
    return (isValueExceedsPlus(averageValues[index], averageValues, SD) &&
        isValueExceedsPlus(averageValues[index + 1], averageValues, SD)) ||
        (isValueExceedsMinus(averageValues[index], averageValues, SD) &&
            isValueExceedsMinus(averageValues[index + 1], averageValues, SD));
}

function Rule13S(index: number, averageValues: number[], SD: number) {
    return averageValues[index] > averageValues[0] + 3 * SD ||
        averageValues[index] < averageValues[0] - 3 * SD;
}

function RuleR4S(index: number, averageValues: number[], SD: number) {
    return (isValueExceedsPlus(averageValues[index], averageValues, SD) &&
        isValueExceedsMinus(averageValues[index + 1], averageValues, SD)) ||
        (isValueExceedsMinus(averageValues[index], averageValues, SD) &&
            isValueExceedsPlus(averageValues[index + 1], averageValues, SD));
}

function Rule8X(index: number, averageValues: number[]) {
    let numOfPlusExceeds = 0;
    let numOfMinusExceeds = 0;
    for (let i = 0; i < 8; i++) {
        if (averageValues[index + i] > averageValues[0]) numOfPlusExceeds += 1;
        else numOfMinusExceeds += 1;
    }

    return numOfMinusExceeds === 8 || numOfPlusExceeds === 8;
}

function Rule41S(index: number, averageValues: number[], SD: number) {
    let numOfPlusExceeds = 0;
    let numOfMinusExceeds = 0;
    for (let i = 0; i < 4; i++) {
        if (averageValues[index + i] > averageValues[0] + SD)
            numOfPlusExceeds += 1;
        else if (
            averageValues[index + i] <
            averageValues[0] - SD
        )
            numOfMinusExceeds += 1;
    }

    return numOfMinusExceeds === 4 || numOfPlusExceeds === 4;
}
