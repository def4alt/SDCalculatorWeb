import TestModel from './../models/TestModel'
import SampleType from './../models/SampleType'
import xlsx from 'xlsx'


function Read(file) {
    var models = new Array

    var reader = new FileReader;
    reader.readAsBinaryString(file);
    reader.onload = function (e) {


        var workbook = xlsx.read(reader.result, {
            type: 'binary'
        });

        var sheet = workbook.Sheets[workbook.SheetNames[0]]

        var range = xlsx.utils.decode_range(sheet['!ref'])

        const columnTitleRow = 2

        var range = xlsx.utils.decode_range(sheet['!ref']);
        for (let rowNum = range.s.r + 4; rowNum <= range.e.r; rowNum++) {
            var model = new TestModel;
            var sampleType = sheet[xlsx.utils.encode_cell({
                r: rowNum,
                c: 3
            })];
            var failedTests = sheet[xlsx.utils.encode_cell({
                r: rowNum,
                c: 5
            })];
            if (sampleType == null) continue
            model.sampleType = sampleType.v.trim() == 'QC Lv I' ? SampleType.Lvl1 : SampleType.Lvl2
            model.failedTests = String(failedTests.v).split(',')

            for (let col = range.s.c + 6; col <= range.e.c; col++) {
                var testValue = sheet[xlsx.utils.encode_cell({
                    r: rowNum,
                    c: col
                })];
                if (testValue == null) continue
                testValue = parseFloat(testValue.v)
                if (testValue == 0.0) continue;

                var testName = sheet[xlsx.utils.encode_cell({
                    r: columnTitleRow,
                    c: col
                })];

                if (testName == null) continue

                testName = String(testName.v).trim()

                if (testName.includes(':')) testName = testName.replace(':', '_')
                if (!testName.includes('/')) model.testResults[testName] = Math.round(testValue)
            }
            models.push(model)
        }
    };
    return models
}

export default Read;