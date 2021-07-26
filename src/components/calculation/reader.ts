import { Range, read, Sheet, utils, WorkSheet } from "xlsx";
import { err, ok, Result } from "neverthrow";
import moment from "moment";
import Westgard from "./westgard";
import {
    CalculationError,
    Dictionary,
    FailedToParseError,
    ReadModel,
    SampleType,
    StatModel,
    XlsxFailedToGetCellError,
} from "../../types";
import getStatModels from "./statistics";

const types = /(\.xls|\.xlsx)$/i;
const dateCheck = /\d{2}_\d{2}_\d{2}/i;

export const getValueFromCell = (
    row: number,
    column: number,
    sheet: Sheet
): Result<string | boolean | Date | number, XlsxFailedToGetCellError> => {
    const cellAddress = utils.encode_cell({
        r: row,
        c: column,
    });

    const value = sheet[cellAddress];

    if (!value || value.v === undefined)
        return err(
            new XlsxFailedToGetCellError(
                `Failed to get ${cellAddress} cell`,
                "getValueFromCell, reader.ts"
            )
        );

    return ok(value.v);
};

const calculate = async (
    files: File[],
    previousStatModels: StatModel[],
    sdMode: boolean
): Promise<Result<StatModel[], CalculationError>> => {
    const readModels = await getReadModels(files);
    if (readModels.length === 0)
        return err(
            new CalculationError(
                "readModels array is empty",
                "calculate, reader.ts"
            )
        );

    const statModels = getStatModels(readModels);
    if (statModels.length === 0)
        return err(
            new CalculationError(
                "statModels array is empty",
                "calculate, reader.ts"
            )
        );

    if (sdMode) return ok(statModels);
    else return ok(appendNewModels(previousStatModels, statModels));
};

export const getReadModels = async (files: File[]) => {
    let readModels: ReadModel[] = [];

    for (const file of files) {
        if (!file.name.match(types)) continue;

        await readFile(file).then((parsed) =>
            parsed.forEach((model) => readModels.push(model))
        );
    }

    return readModels;
};

export const readFile = (file: File) =>
    new Promise<ReadModel[]>((resolve) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = () => {
            const workbook = read(reader.result, {
                type: "binary",
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

    for (let currentRow = startRow; currentRow <= endRow; currentRow++)
        models.push(getModel(sheet, currentRow, sheetRange, fileName));

    return models;
};

export const getModel = (
    sheet: Sheet,
    row: number,
    sheetRange: Range,
    fileName: string
) => {
    let model = {} as ReadModel;

    model.Date = [getDate(fileName)];
    model.FailedTests = getFailedTests(sheet, row);
    const sampleType = getSampleType(sheet, row);
    model.SampleType = sampleType.isOk() ? sampleType.value : SampleType.Null;
    model.TestResults = getTestResults(sheet, sheetRange, row);

    return model;
};

export const getDate = (fileName: string): string => {
    const regexArr = dateCheck.exec(fileName);

    if (!regexArr) return new Date().toUTCString();

    const dateString = regexArr[0];

    return moment(dateString, "DD_MM_YY").toDate().toUTCString();
};

export const getFailedTests = (sheet: WorkSheet, row: number) => {
    const FAILED_TESTS_COLUMN = 5;
    const failedTestsCell = getValueFromCell(row, FAILED_TESTS_COLUMN, sheet);

    if (failedTestsCell.isErr()) return [];

    return (failedTestsCell.value as string).split(",");
};

export const getSampleType = (
    sheet: WorkSheet,
    row: number
): Result<SampleType, FailedToParseError> => {
    const SAMPLE_TYPE_COLUMN = 3;
    const sampleTypeCell = getValueFromCell(row, SAMPLE_TYPE_COLUMN, sheet);

    if (sampleTypeCell.isErr())
        return err(
            new FailedToParseError(
                `Failed to parse undefined to SampleType`,
                "getSampleType, reader.ts"
            )
        );

    switch ((sampleTypeCell.value as string).toUpperCase()) {
        case "QC LV I":
            return ok(SampleType.Lvl1);
        case "QC LV II":
            return ok(SampleType.Lvl2);

        default:
            return err(
                new FailedToParseError(
                    `Failed to parse ${sampleTypeCell.value} to SampleType`,
                    "getSampleType, reader.ts"
                )
            );
    }
};

export const getTestResults = (sheet: WorkSheet, range: Range, row: number) => {
    const VALUE_COLUMN = 6;
    const startColumn = range.s.c + VALUE_COLUMN;
    const endColumn = range.e.c;
    let testResults = {} as Dictionary<number>;

    for (
        let currentColumn = startColumn;
        currentColumn <= endColumn;
        currentColumn++
    ) {
        const TITLE_ROW = 2;
        const testTitle = getTestTitle(sheet, TITLE_ROW, currentColumn);
        if (testTitle === "") continue;

        const testValueResult = getTestValue(sheet, row, currentColumn);
        if (testValueResult.isErr()) continue;

        testResults[testTitle] = Math.round(testValueResult.value * 100) / 100;
    }

    return testResults;
};

export const getTestTitle = (
    sheet: WorkSheet,
    row: number,
    column: number
): string => {
    const testTitleCell = getValueFromCell(row, column, sheet);

    if (testTitleCell.isErr()) return "";

    const testTitle = (testTitleCell.value as string).trim();

    if (testTitle.includes("/")) return "";

    return testTitle;
};

export const getTestValue = (
    sheet: WorkSheet,
    row: number,
    column: number
): Result<number, FailedToParseError> => {
    const testValueCell = getValueFromCell(row, column, sheet);
    if (testValueCell.isErr())
        return err(
            new FailedToParseError(
                `Failed to parse undefined to number`,
                "getTestValue, reader.ts"
            )
        );

    const testValue = testValueCell.value as number;
    if (isNaN(testValue))
        return err(
            new FailedToParseError(
                `Failed to parse ${testValueCell.value} to number`,
                "getTestValue, reader.ts"
            )
        );

    return ok(testValue);
};

export const appendNewModels = (
    previousModels: StatModel[],
    models: StatModel[]
) => {
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

export const appendStatModel = (
    previousModel: StatModel,
    model: StatModel
): StatModel => {
    previousModel.Average.push(model.Average[0]);
    previousModel.Date.push(model.Date[0]);
    previousModel.Warnings.push(getWarning(previousModel));

    return previousModel;
};

export const getWarning = (model: StatModel) => {
    const westgard = new Westgard();
    const warning = westgard.check(model.Average, model.SD);

    const previousWarning = model.Warnings[model.Warnings.length - 1];

    if (warning !== previousWarning) return warning;

    return " ";
};

export default calculate;
