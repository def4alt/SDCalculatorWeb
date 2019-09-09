import Read from './reader'

import SampleType from './../models/SampleType'
import StatisticsModel from '../models/StatisticsModel';

function CalculateSD(files) {
    var models = []
    Array.from(files).forEach(file => {
        var parsedRows = Read(file)
        console.log(parsedRows)
        
    })
        
    console.log(models)
    var ignoreList = []
    var statisticsModels = GetStatistics(models, ignoreList)

    return statisticsModels
}

function* GetStatistics(models, ignoreList) {
    var lvlOneRows = models.filter(t => t.sampleType == SampleType.Lvl1)
    var lvlOneRows = models.filter(t => t.sampleType == SampleType.Lvl2)

    var row = lvlOneRows[0]

    if (row == null) yield null

    var count = row.testResults.length

    for (let i = 0; i < count; i++) {
        var testName = lvlOneRows[0].testResults.keys()[i]

        if (testName == null) continue

        var model = GetModel(lvlOneRows, testName, SampleType.Lvl1, ignoreList)
        if (model != null)
            yield model

        console.log(model)
        model = GetModel(lvlTwoRows, testName, SampleType.Lvl2, ignoreList)
        if (model != null)
            yield model
    }
}

function GetModel(lvlRows, testName, sampleType, ignoreList) {
    var fullName = testName + String(sampleType)

    if (ignoreList.includes(fullName)) return null

    var model = new StatisticsModel;

    model.average = GetAverageFor(lvlRows, testName)
    model.standardDeviation = GetStandardDeviation(lvlRows, testName)
    model.testName = testName.trim()
    model.SampleType = sampleType

    return model
}

function GetAverageFor(models, testName) {
    var nonFailedResults = GetNonFailedResults(models, testName)

    return nonFailedResults.reduce((s1, s2) => s1 + s2, 0.0)
}

function GetStandardDeviation(models, testName) {
    var nonFailedResults = GetNonFailedResults(models, testName)
    var average = GetAverageFor(models, testName)

    var count = nonFailedResults.length
    var sqSum = nonFailedResults.reduce((s1, s2) => s1 + (s2 - average) * (s2 - average) / count, 0.0)

    return Math.sqrt(sqSum)
}

function GetNonFailedResults(models, testName) {
    return model.filter(t => !t.failedTest.includes(testName.trim())).filter(t => testName in t.testResults)
}

export default CalculateSD;