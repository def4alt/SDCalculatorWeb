import { Sheet, read, utils } from "xlsx";
import moment from "moment";
import CheckValues from "./westgard";
import { StatModel, ReadModel, SampleType } from "../../types";
import GetStatistics from "./statistics";

const types = /(\.xls|\.xlsx)$/i;

export default async function Calculate(
    files: File[],
    globalStatModels: StatModel[],
    sdMode: boolean
): Promise<StatModel[]> {
    let newModels: StatModel[] = [];
    const parsedRows: ReadModel[] = [];

    for (const file of files) {
        if (!file.name.match(types)) continue;

        await Read(file).then((parsed) =>
            parsed.forEach((model) => parsedRows.push(model))
        );
    }

    if (parsedRows.length === 0) return [];

    const statModels = GetStatistics(parsedRows);

    if (statModels === undefined || statModels.length === 0) return [];

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

const getValueFromCell = (r: number, c: number, sheet: Sheet) =>
    sheet[
        utils.encode_cell({
            r: r,
            c: c,
        })
    ];

function Read(file: File): Promise<ReadModel[]> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = () => {
            let models = [];

            let date = moment(
                String(file.name)
                    .replace("Summary Report", "")
                    .replace("-", "")
                    .replace(".wiff", "")
                    .replace(".xls", "")
                    .replace("_", "/")
                    .replace("_", "/")
                    .trim(),
                "DD/MM/YY"
            )
                .toDate()
                .toUTCString();

            date = date ? date : new Date().toUTCString();

            const workbook = read(reader.result, {
                type: "binary",
            });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const columnTitleRow = 2;

            const range = utils.decode_range(sheet["!ref"] || "");
            for (let rowNum = range.s.r + 4; rowNum <= range.e.r; rowNum++) {
                const sampleTypeCell = getValueFromCell(rowNum, 3, sheet);

                if (!sampleTypeCell) continue;

                const failedTestsCell = getValueFromCell(rowNum, 5, sheet);

                const sampleType =
                    sampleTypeCell.v.trim() === "QC Lv I"
                        ? SampleType.Lvl1
                        : sampleTypeCell.v.trim() === "QC LV II"
                        ? SampleType.Lvl2
                        : SampleType.Null;

                const failedTests = String(failedTestsCell.v).split(",");

                const testResults: { [x: string]: number } = {};

                for (let col = range.s.c + 6; col <= range.e.c; col++) {
                    const testValueCell = getValueFromCell(rowNum, col, sheet);
                    let testValue = parseFloat(testValueCell.v);
                    if (isNaN(testValue)) testValue = 0;

                    const testNameCell = getValueFromCell(
                        columnTitleRow,
                        col,
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
}
