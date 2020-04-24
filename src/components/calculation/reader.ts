import { Range, read, Sheet, utils, WorkSheet } from "xlsx";
import moment from "moment";
import CheckValues from "./westgard";
import { ReadModel, SampleType, StatModel } from "../../types";
import getStatistics from "./statistics";

const types = /(\.xls|\.xlsx)$/i;
const dateCheck = /\d{2}_\d{2}_\d{2}/i;

const Calculate = async (
    files: File[],
    globalStatModels: StatModel[],
    sdMode: boolean
) => {
    let newStatModels = <StatModel[]>[];

    const readModels = await getReadModels(files);
    if (readModels.length === 0) return [];

    const statModels = await getStatistics(readModels);
    if (statModels.length === 0) return [];

    if (!sdMode)
        newStatModels = addAverage(globalStatModels, statModels);
    else newStatModels = statModels;

    return newStatModels;
};

const addAverage = (globalStatModels: StatModel[], statModels: StatModel[]) => {
    let newStatModels = <StatModel[]>[];
    Object.assign<StatModel[], StatModel[]>(newStatModels, globalStatModels);

    statModels.forEach((model) => {
        let newModel = newStatModels.filter(
            (t) =>
                t.TestName === model.TestName &&
                t.SampleType === model.SampleType
        )[0];

        if (!newModel) return;

        newModel.Average.push(model.Average[0]);
        newModel.Date.push(model.Date[0]);

        const warning = CheckValues(newModel.Average, newModel.SD);

        newModel.Warnings.push(
            warning !== newModel.Warnings[newModel.Warnings.length - 1]
                ? warning
                : " "
        );
    });

    return newStatModels;
};

const getReadModels = async (files: File[]) => {
    let readModels = <ReadModel[]>[];
    for (const file of files) {
        if (!file.name.match(types)) return [];

        await readSheet(file).then((parsed) =>
            parsed.forEach((model) => readModels.push(model))
        );
    }

    return readModels;
};


const getValueFromCell = (row: number, column: number, sheet: Sheet) =>
    sheet[
        utils.encode_cell({
            r: row,
            c: column
        })
        ];

const getDate = (fileName: string) => {
    let date = new Date().toUTCString();

    const regexArr = dateCheck.exec(fileName);
    if (regexArr)
        date = moment(regexArr[0], "DD_MM_YY").toDate().toUTCString();

    return date;
};

const getTestTitle = (sheet: WorkSheet, currentColumn: number) => {
    const columnTitleRow = 2;
    const testTitleCell = getValueFromCell(
        columnTitleRow,
        currentColumn,
        sheet
    );
    const testTitle = String(testTitleCell.v).trim();

    if (testTitle.includes("/"))
        return "";

    return testTitle;
};

const getTestValue = (sheet: WorkSheet, currentRow: number, currentColumn: number) => {
    const testValueCell = getValueFromCell(
        currentRow,
        currentColumn,
        sheet
    );
    let testValue = parseFloat(testValueCell.v);
    if (isNaN(testValue)) testValue = 0;

    return testValue;
};

const getResults = (sheet: WorkSheet, range: Range, currentRow: number) => {
    const VALUE_COLUMN = 6;
    const startColumn = range.s.c + VALUE_COLUMN;
    const endColumn = range.e.c;
    let testResults = <{ [x: string]: number }>{};

    for (
        let currentColumn = startColumn;
        currentColumn <= endColumn;
        currentColumn++
    ) {
        const testTitle = getTestTitle(sheet, currentColumn);
        if (testTitle == "") continue;

        const testValue = getTestValue(sheet, currentRow, currentColumn);

        testResults[testTitle] =
            Math.round(testValue * 100) / 100;
    }

    return testResults;
};

const getFailedTests = (sheet: WorkSheet, currentRow: number) => {
    const failedTestsCell = getValueFromCell(currentRow, 5, sheet);

    if (!failedTestsCell) return [];

    return String(failedTestsCell.v).split(",");
};

const getSampleType = (sheet: WorkSheet, currentRow: number) => {
    const SAMPLE_TYPE_COLUMN = 3;
    const sampleTypeCell = getValueFromCell(currentRow, SAMPLE_TYPE_COLUMN, sheet);

    if (!sampleTypeCell) return SampleType.Null;

    switch (sampleTypeCell.v.toUpperCase()) {
        case "QC LV I":
            return SampleType.Lvl1;
        case "QC LV II":
            return SampleType.Lvl2;

        default:
            return SampleType.Null;
    }
};

const getModel = (sheet: WorkSheet, currentRow: number, sheetRange: Range, fileName: string) => {
    let model = <ReadModel>{};

    model.Date = [getDate(fileName)];
    model.FailedTests = getFailedTests(sheet, currentRow);
    model.SampleType = getSampleType(sheet, currentRow);
    model.TestResults = getResults(sheet, sheetRange, currentRow);

    return model;
};

const getModels = (sheet: WorkSheet, fileName: string) => {
    const sheetRange = utils.decode_range(sheet["!ref"] || "");
    const VALUE_ROW = 4;
    const startRow = sheetRange.s.r + VALUE_ROW;
    const endRow = sheetRange.e.r;

    let models = <ReadModel[]>[];

    for (
        let currentRow = startRow;
        currentRow <= endRow;
        currentRow++
    )
        models.push(getModel(sheet, currentRow, sheetRange, fileName));

    return models;
};

const readSheet = (file: File) => {
    return new Promise<ReadModel[]>((resolve) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = () => {
            const workbook = read(reader.result, {
                type: "binary"
            });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            resolve(getModels(sheet, file.name));
        };
    });
};


export default Calculate;