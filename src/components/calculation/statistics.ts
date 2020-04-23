import { SampleType, ReadModel } from "../../types";

const GetStatistics = (models: Array<ReadModel>) => {
    const lvlOneRows = models.filter((t) => t.SampleType === SampleType.Lvl1);
    const lvlTwoRows = models.filter((t) => t.SampleType === SampleType.Lvl2);

    const row = lvlOneRows[0];

    if (!row) return [];

    const testResultsLength = Object.keys(row.TestResults).length;

    const statisticsModels = [];
    for (let i = 0; i < testResultsLength; i++) {
        const testName = Object.keys(lvlOneRows[0].TestResults)[i];

        if (!testName) continue;

        if (lvlOneRows) {
            const modelOne = GetModel(lvlOneRows, testName, SampleType.Lvl1);
            if (modelOne) statisticsModels.push(modelOne);
        }

        if (lvlTwoRows) {
            const modelTwo = GetModel(lvlTwoRows, testName, SampleType.Lvl2);
            if (modelTwo) statisticsModels.push(modelTwo);
        }
    }

    return statisticsModels;
};

const GetModel = (
    lvlRows: Array<ReadModel>,
    testName: string,
    sampleType: SampleType
) => {
    let average = GetAverageFor(lvlRows, testName);
    if (isNaN(average)) average = 0;
    let standardDeviation = GetStandardDeviation(lvlRows, testName);
    if (isNaN(standardDeviation)) standardDeviation = 0;

    let date = new Date().toUTCString();
    if (lvlRows[0]) date = lvlRows[0].Date[0];

    return {
        Average: [average],
        SD: standardDeviation,
        TestName: testName.trim(),
        SampleType: sampleType,
        Date: [date],
        Warnings: [""],
    };
};

const GetAverageFor = (models: Array<ReadModel>, testName: string) => {
    const nonFailedResults = GetNonFailedResults(models, testName).map(
        (t) => t.TestResults[testName]
    );

    return (
        nonFailedResults.reduce((s1, s2) => s1 + s2, 0.0) /
        nonFailedResults.length
    );
};

const GetStandardDeviation = (models: Array<ReadModel>, testName: string) => {
    const nonFailedResults = GetNonFailedResults(models, testName).map(
        (t) => t.TestResults[testName]
    );

    const average = GetAverageFor(models, testName);

    const nonFailedResultsLength = nonFailedResults.length;
    const sqSum = nonFailedResults.reduce(
        (s1, s2) =>
            s1 + ((s2 - average) * (s2 - average)) / nonFailedResultsLength,
        0
    );

    return Math.sqrt(sqSum);
};

const GetNonFailedResults = (models: Array<ReadModel>, testName: string) =>
    models
        .filter((t: ReadModel) => !t.FailedTests.includes(testName.trim()))
        .filter((t: ReadModel) => testName in t.TestResults);

export default GetStatistics;
