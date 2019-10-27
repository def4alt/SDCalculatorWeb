import SampleType from './SampleType';

function GetStatistics(models, ignoreList) {

    const lvlOneRows = models.filter(t => t.SampleType === SampleType.Lvl1);
    const lvlTwoRows = models.filter(t => t.SampleType === SampleType.Lvl2);

    const row = lvlOneRows[0];

    if (row === undefined)
        return undefined;

    const count = Object.keys(row.TestResults).length;

    const statisticsModels = [];
    for (let i = 0; i < count; i++) {
        const testName = Object.keys(lvlOneRows[0].TestResults)[i];

        if (testName == null) {
            continue;
        }

        const modelOne = GetModel(lvlOneRows, testName, SampleType.Lvl1, ignoreList);
        if (modelOne != null) {
            statisticsModels.push(modelOne);
        }

        const modelTwo = GetModel(lvlTwoRows, testName, SampleType.Lvl2, ignoreList);
        if (modelTwo != null) {
            statisticsModels.push(modelTwo);
        }
    }

    return statisticsModels;
}

function GetModel(lvlRows, testName, sampleType, ignoreList) {
    const fullName = testName + String(sampleType);

    if (ignoreList.includes(fullName)) {
        return null;
    }
    const average = GetAverageFor(lvlRows, testName);
    const standardDeviation = GetStandardDeviation(lvlRows, testName);

    return {
        Average: [average],
        StandardDeviation: standardDeviation,
        TestName: testName.trim(),
        SampleType: sampleType,
        Date: [lvlRows[0].Date]
    };
}

function GetAverageFor(models, testName) {
    const nonFailedResults = GetNonFailedResults(models, testName).map(t => t.TestResults[testName]);

    return nonFailedResults.reduce((s1, s2) => s1 + s2, 0.0) / nonFailedResults.length;
}

function GetStandardDeviation(models, testName) {
    const nonFailedResults = GetNonFailedResults(models, testName).map(t => t.TestResults[testName]);
    
    const average = GetAverageFor(models, testName);

    const count = nonFailedResults.length;
    const sqSum = nonFailedResults.reduce((s1, s2) => s1 + (s2 - average) * (s2 - average) / count, 0.0);

    return Math.sqrt(sqSum);
}

function GetNonFailedResults(models, testName) {
    return models.filter(t => !t.FailedTests.includes(testName.trim()))
        .filter(t => testName in t.TestResults);
}

export default GetStatistics; 