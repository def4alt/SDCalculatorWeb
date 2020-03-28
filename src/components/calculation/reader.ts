import { Sheet, read, utils } from "xlsx";
import moment from "moment";
import CheckValues from "./westgard";
import { StatModel, ReadModel, SampleType } from "../../types";
import GetStatistics from "./statistics";

function getExtension(name: string): string {
    return name.split(".").pop() as string;
}

export default async function Calculate(
    files: File[],
    globalStatModels: StatModel[],
    sdMode: boolean
): Promise<StatModel[]> {
    const parsedRows: ReadModel[] = [];
    for (const file of files) {
        const extension = getExtension(file.name);
        if (extension === "xlsx" || extension === "xls") {
            await Read(file).then(parsed => {
                for (const model of parsed as ReadModel[]) {
                    parsedRows.push(model);
                }
            });
        }
    }

    if (parsedRows.length === 0) {
    }

    let statModels = GetStatistics(parsedRows);

    if (statModels === undefined || statModels.length === 0) {
        return new Array<StatModel>();
    }

    if (!sdMode) {
        for (let i = 0; i < statModels.length; i++) {
            const model = statModels[i];

            let globalModel = globalStatModels.filter(
                t =>
                    t.TestName === model.TestName &&
                    t.SampleType === model.SampleType
            )[0];

            if (globalModel !== undefined) {
                globalModel.Average.push(model.Average[0]);
                globalModel.Date.push(model.Date[0]);
            }

            let warning = CheckValues(globalModel.Average, globalModel.SD);

            if (
                warning !==
                globalModel.Warnings[globalModel.Warnings.length - 1]
            )
                globalModel.Warnings.push(warning);
            else globalModel.Warnings.push(" ");
        }
    } else {
        globalStatModels = statModels;
    }

    return globalStatModels;
}

const getValueFromCell = (r: number, c: number, sheet: Sheet) => {
    return sheet[
        utils.encode_cell({
            r: r,
            c: c
        })
    ];
};

function Read(file: File): Promise<ReadModel[]> {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = () => {
            const models = [];

            let date: Date = moment(
                String(file.name)
                    .replace("Summary Report", "")
                    .replace("-", "")
                    .replace(".wiff", "")
                    .replace(".xls", "")
                    .replace("_", "/")
                    .replace("_", "/")
                    .trim(),
                "DD/MM/YY"
            ).toDate();

            date = date ? date : new Date();

            const workbook = read(reader.result, {
                type: "binary"
            });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const columnTitleRow = 2;

            const range = utils.decode_range(sheet["!ref"] || "");
            for (let rowNum = range.s.r + 4; rowNum <= range.e.r; rowNum++) {
                const sampleTypeCell = getValueFromCell(rowNum, 3, sheet);

                if (sampleTypeCell == null) {
                    continue;
                }

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

                    if (!testName.includes("/")) {
                        testResults[testName] =
                            Math.round(testValue * 100) / 100;
                    }
                }
                const model = {
                    SampleType: sampleType,
                    FailedTests: failedTests,
                    TestResults: testResults,
                    Date: [date]
                };

                models.push(model);
            }

            resolve(models);
        };
    });
}
