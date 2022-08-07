import { err, ok, Result } from "neverthrow";
import { RawData, SampleType, ProcessedData } from "src/types/common";

export const processData = (
    data: RawData[]
): Result<ProcessedData[], Error> => {
    const validData = data.filter((t) => t.SampleType !== SampleType.Null);
    const sampleRow = validData.at(0);

    if (!sampleRow) {
        return err(new Error("failed to get sample row for processing"));
    }

    let testNames = Object.keys(sampleRow.TestResults);

    const processedData: ProcessedData[] = [];

    testNames.forEach((testName) => {
        const firstModel = processTestOfType(
            validData,
            testName,
            SampleType.Lvl1
        );
        if (firstModel.isErr()) {
            console.log(firstModel.error.message);
            return;
        }
        processedData.push(firstModel.value);

        const secondModel = processTestOfType(
            validData,
            testName,
            SampleType.Lvl2
        );
        if (secondModel.isErr()) {
            console.log(secondModel.error.message);
            return;
        }
        processedData.push(secondModel.value);
    });

    return ok(processedData);
};

const processTestOfType = (
    rawData: RawData[],
    testName: string,
    sampleType: SampleType
): Result<ProcessedData, Error> => {
    if (rawData.length === 0) err(new Error("Read Models length is 0"));

    const dataOfType = rawData.filter((t) => t.SampleType === sampleType);
    const nonFailedResults = getNonFailedResults(dataOfType, testName).map(
        (t) => t.TestResults[testName]
    );

    if (nonFailedResults.length === 0)
        err(new Error("Non Failed Results length is 0"));

    return ok({
        Values: [getAverageFor(nonFailedResults)],
        SD: getStandardDeviation(nonFailedResults),
        TestName: testName,
        SampleType: sampleType,
        Dates: [dataOfType[0].Dates[0]],
        Warnings: [""],
    } as ProcessedData);
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

const getNonFailedResults = (models: RawData[], testName: string): RawData[] =>
    models
        .filter((t: RawData) => !t.FailedTests.includes(testName.trim()))
        .filter((t: RawData) => testName in t.TestResults);
