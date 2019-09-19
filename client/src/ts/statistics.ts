
import TestModel from '../models/TestModel';
import SampleType from '../models/SampleType';
import StatisticsModel from '../models/StatisticsModel';

function GetStatistics(models: TestModel[], ignoreList: string[]) {
    console.log(models);
    console.log(models.filter(t => true));
    const lvlOneRows: TestModel[] = models.filter((t: TestModel) => t.SampleType === SampleType.Lvl1);
    const lvlTwoRows = models.filter((t: TestModel) => t.SampleType === SampleType.Lvl2);
    console.log(lvlOneRows);

    const row = lvlOneRows[0];

    const count = row.TestResults!.length;

    const statisticsModels: StatisticsModel[] = new Array<StatisticsModel>();
    for (let i = 0; i < count; i++) {
        const testName = Object.keys(lvlOneRows[0].TestResults!)[i];

        if (testName == null) {
            continue;
        }

        let model: StatisticsModel = GetModel(lvlOneRows, testName, SampleType.Lvl1, ignoreList)
            || new StatisticsModel();
        if (model != null) {
            statisticsModels.push(model);
        }

        model = GetModel(lvlTwoRows, testName, SampleType.Lvl2, ignoreList) || new StatisticsModel();
        if (model != null) {
            statisticsModels.push(model);
        }
    }

    return statisticsModels;
}

function GetModel(lvlRows: TestModel[], testName: string, sampleType: SampleType, ignoreList: string[]) {
    const fullName = testName + String(sampleType);

    if (ignoreList.includes(fullName)) {
        return null;
    }

    const model: StatisticsModel = new StatisticsModel();
    model.Average = GetAverageFor(lvlRows, testName);
    model.StandardDeviation = GetStandardDeviation(lvlRows, testName);
    model.TestName = testName.trim();
    model.SampleType = sampleType;

    return model;
}

function GetAverageFor(models: TestModel[], testName: string) {
    const nonFailedResults = GetNonFailedResults(models, testName).map((t: TestModel) => t.TestResults![testName]);

    return nonFailedResults.reduce((s1, s2) => s1 + s2, 0.0);
}

function GetStandardDeviation(models: TestModel[], testName: string) {
    const nonFailedResults = GetNonFailedResults(models, testName).map((t: TestModel) => t.TestResults![testName]);
    const average = GetAverageFor(models, testName);

    const count = nonFailedResults.length;
    const sqSum = nonFailedResults.reduce((s1, s2) => s1 + (s2 - average) * (s2 - average) / count, 0.0);

    return Math.sqrt(sqSum);
}

function GetNonFailedResults(models: TestModel[], testName: string) {
    return models.filter((t: TestModel) => !t.FailedTests!.includes(testName.trim()))
        .filter((t: TestModel) => testName in t.TestResults!);
}

export default GetStatistics;
