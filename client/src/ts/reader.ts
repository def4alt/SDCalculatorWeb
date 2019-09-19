import TestModel from '../models/TestModel';
import SampleType from '../models/SampleType';
import xlsx from 'xlsx';


function Read(file: File) {
    const models: TestModel[] = new Array<TestModel>();

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {

        const workbook = xlsx.read(reader.result, {
            type: 'binary',
        });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const columnTitleRow = 2;

        const range = xlsx.utils.decode_range(sheet['!ref'] || '');
        for (let rowNum = range.s.r + 4; rowNum <= range.e.r; rowNum++) {
            const model: TestModel = new TestModel();
            const sampleType = sheet[xlsx.utils.encode_cell({
                r: rowNum,
                c: 3,
            })];
            const failedTests = sheet[xlsx.utils.encode_cell({
                r: rowNum,
                c: 5,
            })];
            if (sampleType == null) {
                continue;
            }
            model.SampleType = sampleType.v.trim() === 'QC Lv I' ?
                SampleType.Lvl1 : (sampleType.v.trim() === 'QC LV II' ?
                SampleType.Lvl2 : SampleType.Null);
            model.FailedTests = String(failedTests.v).split(',');

            for (let col = range.s.c + 6; col <= range.e.c; col++) {
                let testValue = sheet[xlsx.utils.encode_cell({
                    r: rowNum,
                    c: col,
                })];
                if (testValue === null) {
                    continue;
                }
                testValue = parseFloat(testValue.v);
                if (testValue === 0.0) {
                    continue;
                }

                let testName = sheet[xlsx.utils.encode_cell({
                    r: columnTitleRow,
                    c: col,
                })];

                if (testName == null) {
                    continue;
                }

                testName = String(testName.v).trim();

                if (testName.includes(':')) {
                    testName = testName.replace(':', '_');
                }
                if (!testName.includes('/')) {
                    model.TestResults[testName] = Math.round(testValue);
                }
            }
            models.push(model);
        }
    };
    return models;
}

export default Read;
