import { CellObject, read as readXLSX, Sheet, utils, WorkSheet } from "xlsx";
import { err, ok, Result } from "neverthrow";
import moment from "moment";
import { Dictionary, RawData, SampleType } from "src/types/common";

const SUPPORTED_FILE_TYPES = /(\.xls|\.xlsx)$/i;
const SUPPORTED_DATE_TYPE = /\d{2}_\d{2}_\d{2}/i;
const TITLE_ROW = 2;
const VALUE_ROW = 4;
const SAMPLE_TYPE_COLUMN = 3;
const FAILED_TESTS_COLUMN = 5;
const TEST_RESULTS_COLUMN = 6;

const TEST_NAME_BLACKLIST_CHARACTERS = /[\/]/i;

type CellValueType = string | boolean | Date | number;

export const read = async (files: File[]) => {
    let rawData: RawData[] = [];

    for (const file of files) {
        if (!file.name.match(SUPPORTED_FILE_TYPES)) continue;

        await readFile(file).then((parsed) =>
            parsed.forEach((model) => rawData.push(model))
        );
    }

    return rawData;
};

const readFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    return new Promise<RawData[]>((resolve) => {
        reader.onload = () => {
            const workbook = readXLSX(reader.result, {
                type: "binary",
            });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            resolve(extractDataFromSheet(sheet, file.name));
        };
    });
};

const extractDataFromSheet = (sheet: WorkSheet, fileName: string) => {
    const sheetRange = utils.decode_range(sheet["!ref"] || "");
    const startRow = sheetRange.s.r + VALUE_ROW;
    const endRow = sheetRange.e.r;

    let data: RawData[] = [];

    for (let currentRow = startRow; currentRow <= endRow; currentRow++)
        data.push(extractDataFromRow(sheet, currentRow, fileName));

    return data;
};

const extractDataFromRow = (sheet: Sheet, row: number, fileName: string) => {
    let data = {} as RawData;

    data.Dates = [getDate(fileName)];
    data.FailedTests = getFailedTests(sheet, row);
    const sampleType = getSampleType(sheet, row);
    data.SampleType = sampleType.isOk() ? sampleType.value : SampleType.Null;
    data.TestResults = getTestResults(sheet, row);

    return data;
};

const getDate = (fileName: string): Date => {
    const regexArr = SUPPORTED_DATE_TYPE.exec(fileName);

    if (!regexArr) return new Date();

    const dateString = regexArr[0];

    return moment(dateString, "DD_MM_YY").toDate();
};

const getFailedTests = (sheet: WorkSheet, row: number) => {
    const failedTestsCell = getValueFromCell(sheet, row, FAILED_TESTS_COLUMN);

    if (failedTestsCell.isErr()) return [];

    return (failedTestsCell.value as string).split(",");
};

const getValueFromCell = (
    sheet: Sheet,
    row: number,
    column: number
): Result<CellValueType, Error> => {
    const cellAddress = utils.encode_cell({
        r: row,
        c: column,
    });

    const value: CellObject | undefined = sheet[cellAddress];

    if (value?.v === undefined)
        return err(new Error(`Failed to get ${cellAddress} cell`));

    return ok(value.v);
};

const getSampleType = (
    sheet: WorkSheet,
    row: number
): Result<SampleType, Error> => {
    const sampleTypeCell = getValueFromCell(sheet, row, SAMPLE_TYPE_COLUMN);

    if (sampleTypeCell.isErr())
        return err(new Error(`Failed to parse undefined to SampleType`));

    switch ((sampleTypeCell.value as string).toUpperCase().trim()) {
        case "QC LV I":
            return ok(SampleType.Lvl1);
        case "QC LV II":
            return ok(SampleType.Lvl2);

        default:
            return err(
                new Error(
                    `Failed to parse ${sampleTypeCell.value} to SampleType`
                )
            );
    }
};

const getTestResults = (sheet: WorkSheet, row: number) => {
    const sheetRange = utils.decode_range(sheet["!ref"] || "");
    const startColumn = sheetRange.s.c + TEST_RESULTS_COLUMN;
    const endColumn = sheetRange.e.c;

    let testResults = {} as Dictionary<number>;

    for (let column = startColumn; column <= endColumn; column++) {
        const testTitleCell = getValueFromCell(sheet, TITLE_ROW, column);

        if (testTitleCell.isErr()) continue;

        const testTitle = (testTitleCell.value as string).trim();

        if (testTitle.match(TEST_NAME_BLACKLIST_CHARACTERS)) continue;

        const testValueCell = getValueFromCell(sheet, row, column);
        if (testValueCell.isErr()) continue;

        const testValue = testValueCell.value as number;
        if (isNaN(testValue)) continue;

        testResults[testTitle] = Math.round(testValue * 1000) / 1000;
    }

    return testResults;
};
