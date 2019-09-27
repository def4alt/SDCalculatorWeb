import xlsx from 'xlsx';
import SampleType from '../js/SampleType'


const getValueFromCell = (r, c, sheet) => {
    return sheet[xlsx.utils.encode_cell({
        r: r,
        c: c,
    })];
};

function Read(file) {
    const models = new Array;

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {

        const workbook = xlsx.read(reader.result, {
            type: 'binary',
        });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const columnTitleRow = 2;

        const range = xlsx.utils.decode_range(sheet['!ref'] || '');
        for (let rowNum = range.s.r + 4; rowNum <= range.e.r; rowNum++) {

            const sampleTypeCell = getValueFromCell(rowNum, 3, sheet);
            
            if (sampleTypeCell == null) {
                continue;
            }

            const failedTestsCell = getValueFromCell(rowNum, 5, sheet);

            const sampleType = sampleTypeCell.v.trim() === 'QC Lv I' ?
                SampleType.Lvl1 : (sampleTypeCell.v.trim() === 'QC LV II' ?
                    SampleType.Lvl2 : SampleType.Null);

            const failedTests = String(failedTestsCell.v).split(',');

            const testResults = {};

            for (let col = range.s.c + 6; col <= range.e.c; col++) {
                const testValueCell = getValueFromCell(rowNum, col, sheet);
                const testValue = parseFloat(testValueCell.v);              

                const testNameCell = getValueFromCell(columnTitleRow, col, sheet);
                const testName = String(testNameCell.v).trim();

                if (!testName.includes('/')) {
                    testResults[testName] = Math.round(testValue);
                }
            }
            const model = Object.freeze({
                SampleType: sampleType,
                FailedTests: failedTests,
                TestResults: testResults
            });

            models.push(model);
        }
    };
    return models;
}

export default Read;