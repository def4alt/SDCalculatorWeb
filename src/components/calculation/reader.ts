import { Range, read, Sheet, utils, WorkSheet } from "xlsx";
import moment from "moment";
import Westgard from "./westgard";
import {
    CalculationError,
    Dictionary,
    FailedToParseError,
    ReadModel,
    SampleType,
    StatModel, VerifiedCellObject,
    XlsxFailedToGetCellError
} from "../../types";
import getStatModels from "./statistics";

const types = /(\.xls|\.xlsx)$/i;
const dateCheck = /\d{2}_\d{2}_\d{2}/i;

export const getValueFromCell = (row: number, column: number, sheet: Sheet): VerifiedCellObject => {
    const cellAddress = utils.encode_cell({
        r: row,
        c: column
    });

    const value = sheet[cellAddress];

    if(!value || value.v == undefined)
        throw new XlsxFailedToGetCellError(`Failed to get ${cellAddress} cell`,
            "getValueFromCell, reader.ts");

    return value;
}

const calculate = async (
    files: File[],
    previousStatModels: StatModel[],
    sdMode: boolean
): Promise<StatModel[]> => {
    const readModels = await getReadModels(files);
    if (readModels.length === 0)
        throw new CalculationError(
            "readModels array is empty",
            "calculate, reader.ts");

    const statModels = await getStatModels(readModels);
    if (statModels.length === 0)
        throw new CalculationError(
            "statModels array is empty",
            "calculate, reader.ts");

    if (sdMode) return statModels;
    else return appendNewModels(previousStatModels, statModels);
};

export const getReadModels = async (files: File[]) => {
    let readModels = <ReadModel[]>[];

    for (const file of files) {
        if (!file.name.match(types)) continue;

        await readFile(file).then((parsed) =>
            parsed.forEach((model) => readModels.push(model))
        );
    }

    return readModels;
};

export const readFile = (file: File) => new Promise<ReadModel[]>((resolve) => {
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

export const getModels = (sheet: WorkSheet, fileName: string) => {
    const sheetRange = utils.decode_range(sheet["!ref"] || "");
    const VALUE_ROW = 4;
    const startRow = sheetRange.s.r + VALUE_ROW;
    const endRow = sheetRange.e.r;

    let models: ReadModel[] = [];

    for (
        let currentRow = startRow;
        currentRow <= endRow;
        currentRow++
    )
        models.push(getModel(sheet, currentRow, sheetRange, fileName));

    return models;
};

export const getModel = (sheet: Sheet, row: number, sheetRange: Range,
                         fileName: string) => {
    let model = <ReadModel>{};

    model.Date = [getDate(fileName)];
    model.FailedTests = getFailedTests(sheet, row);
    model.SampleType = getSampleType(sheet, row);
    model.TestResults = getTestResults(sheet, sheetRange, row);

    return model;
};

export const getDate = (fileName: string): string => {
    const regexArr = dateCheck.exec(fileName);

    if (!regexArr)
        return new Date().toUTCString();

    const dateString = regexArr[0];

    return moment(dateString, "DD_MM_YY").toDate().toUTCString();
};

export const getFailedTests = (sheet: WorkSheet, row: number) => {
    const FAILED_TESTS_COLUMN = 5;
    const failedTestsCell = getValueFromCell(row, FAILED_TESTS_COLUMN, sheet);

    return String(failedTestsCell.v).split(",");
};

export const getSampleType = (sheet: WorkSheet, row: number) => {
    const SAMPLE_TYPE_COLUMN = 3;
    const sampleTypeCell = getValueFromCell(row, SAMPLE_TYPE_COLUMN, sheet);

    switch ((sampleTypeCell.v as string).toUpperCase()) {
        case "QC LV I":
            return SampleType.Lvl1;
        case "QC LV II":
            return SampleType.Lvl2;

        default:
            throw new FailedToParseError(
                `Failed to parse ${sampleTypeCell.v} to SampleType`,
                "getSampleType, reader.ts")
    }
};

export const getTestResults = (sheet: WorkSheet, range: Range, row: number) => {
    const VALUE_COLUMN = 6;
    const startColumn = range.s.c + VALUE_COLUMN;
    const endColumn = range.e.c;
    let testResults = <Dictionary<number>>{};

    for (
        let currentColumn = startColumn;
        currentColumn <= endColumn;
        currentColumn++
    ) {
        const TITLE_ROW = 2;
        const testTitle = getTestTitle(sheet, TITLE_ROW, currentColumn);
        if (testTitle == "") continue;

        const testValue = getTestValue(sheet, row, currentColumn);

        testResults[testTitle] =
            Math.round(testValue * 100) / 100;
    }

    return testResults;
};

export const getTestTitle = (sheet: WorkSheet, row: number, column: number) => {
    const testTitleCell = getValueFromCell(
        row,
        column,
        sheet
    );
    const testTitle = (testTitleCell.v as string).trim();

    if (testTitle.includes("/"))
        return "";

    return testTitle;
};


export const getTestValue = (sheet: WorkSheet, row: number,
                             column: number): number => {
    const testValueCell = getValueFromCell(
        row,
        column,
        sheet
    );
    let testValue = testValueCell.v as number;
    if (isNaN(testValue))
        throw new FailedToParseError(
            `Failed to parse ${testValueCell.v} to number`,
            "getTestValue, reader.ts");

    return testValue;
};

export const appendNewModels = (previousModels: StatModel[], models: StatModel[]) => {
    let newStatModels: StatModel[] = [];
    Object.assign(newStatModels, previousModels);

    models.forEach((model) => {
        const newModel = newStatModels.filter(
            (t) =>
                t.TestName === model.TestName &&
                t.SampleType === model.SampleType
        )[0];

        if (!newModel) return;

        appendStatModel(newModel, model);
    });

    return newStatModels;
};

export const appendStatModel = (previousModel: StatModel, model: StatModel): StatModel => {
    previousModel.Average.push(model.Average[0]);
    previousModel.Date.push(model.Date[0]);
    previousModel.Warnings.push(getWarning(previousModel));

    return previousModel;
}

export const getWarning = (model: StatModel) => {
    const westgard = new Westgard();
    const warning = westgard.check(model.Average, model.SD);

    const previousWarning = model.Warnings[model.Warnings.length - 1];

    if (warning !== previousWarning)
        return warning;

    return " ";
}

export default calculate;