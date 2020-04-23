import { Sheet, read, utils } from "xlsx";
import moment from "moment";
import CheckValues from "./westgard";
import { StatModel, ReadModel, SampleType } from "../../types";
import GetStatistics from "./statistics";

const types = /(\.xls|\.xlsx)$/i;
const dateCheck = /\d{2}_\d{2}_\d{2}/i;

export default async function Calculate(
    files: File[],
    globalStatModels: StatModel[],
    sdMode: boolean
): Promise<StatModel[]> {
    let newModels: StatModel[] = [];
    let parsedRows: ReadModel[] = [];

    for (const file of files) {
        if (!file.name.match(types)) continue;

        await Read(file).then((parsed) =>
            parsed.forEach((model) => parsedRows.push(model))
        );
    }

    if (parsedRows.length === 0) return [];

    const statModels = GetStatistics(parsedRows);

    if (!statModels || statModels.length === 0) return [];

    if (!sdMode) {
        Object.assign<StatModel[], StatModel[]>(newModels, globalStatModels);
        statModels.forEach((model) => {
            let newModel = newModels.filter(
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
    } else newModels = statModels;

    return newModels;
}

const getValueFromCell = (row: number, column: number, sheet: Sheet) =>
    sheet[
        utils.encode_cell({
            r: row,
            c: column,
        })
    ];

const getSampleType = (value: string) => {
    switch (value) {
        case "QC LV I":
            return SampleType.Lvl1;
        case "QC LV II":
            return SampleType.Lvl2;

        default:
            return SampleType.Null;
    }
};

const Read = (file: File) =>
    new Promise<ReadModel[]>((resolve) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = () => {
            let models = [];

            let date = new Date().toUTCString();

            const regexArr = dateCheck.exec(file.name);
            if (regexArr)
                date = moment(regexArr[0], "DD_MM_YY").toDate().toUTCString();

            const workbook = read(reader.result, {
                type: "binary",
            });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const columnTitleRow = 2;

            const range = utils.decode_range(sheet["!ref"] || "");
            const startRow = range.s.r;
            const endRow = range.e.r;
            const startColumn = range.s.c;
            const endColumn = range.e.c;

            for (
                let currentRow = startRow + 4;
                currentRow <= endRow;
                currentRow++
            ) {
                const sampleTypeCell = getValueFromCell(currentRow, 3, sheet);

                if (!sampleTypeCell) continue;

                const sampleType = getSampleType(
                    String(sampleTypeCell.v.trim()).toUpperCase()
                );

                const failedTestsCell = getValueFromCell(currentRow, 5, sheet);
                const failedTests = String(failedTestsCell.v).split(",");

                let testResults: { [x: string]: number } = {};

                for (
                    let currentColumn = startColumn + 6;
                    currentColumn <= endColumn;
                    currentColumn++
                ) {
                    const testValueCell = getValueFromCell(
                        currentRow,
                        currentColumn,
                        sheet
                    );
                    let testValue = parseFloat(testValueCell.v);
                    if (isNaN(testValue)) testValue = 0;

                    const testNameCell = getValueFromCell(
                        columnTitleRow,
                        currentColumn,
                        sheet
                    );
                    const testName = String(testNameCell.v).trim();

                    if (!testName.includes("/"))
                        testResults[testName] =
                            Math.round(testValue * 100) / 100;
                }
                const model = {
                    SampleType: sampleType,
                    FailedTests: failedTests,
                    TestResults: testResults,
                    Date: [date],
                };

                models.push(model);
            }

            resolve(models);
        };
    });
