import {
    InvalidArgumentError,
    ReadModel,
    SampleType,
    StatModel,
} from "../../types";

const getStatModels = (models: Array<ReadModel>): StatModel[] => {
    const validModels = models.filter((t) => t.SampleType !== SampleType.Null);
    const row = validModels[0];

    if (!row) return [];

    const testResultsLength = Object.keys(row.TestResults).length;

    const statisticsModels: StatModel[] = [];
    for (let i = 0; i < testResultsLength; i++) {
        const testName = Object.keys(validModels[0].TestResults)[i];

        if (!testName) continue;

        try {
            const model = getModel(validModels, testName, SampleType.Lvl1);
            statisticsModels.push(model);
        } catch (e) {}

        try {
            const model = getModel(validModels, testName, SampleType.Lvl2);
            statisticsModels.push(model);
        } catch (e) {}
    }

    return statisticsModels;
};

const getModel = (
    readModels: ReadModel[],
    testName: string,
    sampleType: SampleType
): StatModel => {
    if (readModels.length === 0)
        throw new InvalidArgumentError("Read Models length is 0");

    const levelModels = readModels.filter((t) => t.SampleType === sampleType);
    const nonFailedResults = getNonFailedResults(levelModels, testName).map(
        (t) => t.TestResults[testName]
    );

    if (nonFailedResults.length === 0)
        throw new InvalidArgumentError("Non Failed Results length is 0");

    return {
        Average: [getAverageFor(nonFailedResults)],
        SD: getStandardDeviation(nonFailedResults),
        TestName: testName.trim(),
        SampleType: sampleType,
        Date: [levelModels[0].Date[0]],
        Warnings: [" "],
    } as StatModel;
};

const getAverageFor = (numbers: Array<number>): number => {
    if (numbers.length === 0) return 0;

    return (
        Math.floor(
            (numbers.reduce((s1, s2) => s1 + s2, 0.0) / numbers.length) * 1000
        ) / 1000
    );
};

const getStandardDeviation = (numbers: Array<number>): number => {
    if (numbers.length === 0) return 0;

    const average = getAverageFor(numbers);

    const sqSum = numbers.reduce(
        (s1, s2) => s1 + ((s2 - average) * (s2 - average)) / numbers.length,
        0
    );

    return Math.floor(Math.sqrt(sqSum) * 1000) / 1000;
};

const getNonFailedResults = (
    models: ReadModel[],
    testName: string
): ReadModel[] =>
    models
        .filter((t: ReadModel) => !t.FailedTests.includes(testName.trim()))
        .filter((t: ReadModel) => testName in t.TestResults);

export default getStatModels;
export { getModel, getAverageFor, getStandardDeviation, getNonFailedResults };
