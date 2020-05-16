import {
    appendNewModels,
    appendStatModel, getDate, getFailedTests,
    getTestResults, getSampleType,
    getTestTitle,
    getTestValue,
    getValueFromCell,
    getWarning, getModel, getModels
} from "./reader";
import { CellObject, Sheet, utils } from "xlsx";
import { FailedToParseError, SampleType, StatModel, XlsxFailedToGetCellError } from "../../types";
import moment from "moment";


const sheet: Sheet = {
    ["A1"]: <CellObject>{ v: 1 },
    ["A2"]: <CellObject>{ v: "string " },
    ["A3"]: <CellObject>{ v: "string/" },
    '!ref': "A1:B3",
}

test("Get Value From Cell", () => {
    const value = getValueFromCell(0, 0, sheet);
    expect(value.v).toBe(1);

    expect(() => getValueFromCell(0, 1, sheet))
        .toThrowError(XlsxFailedToGetCellError);
});

test("Get Warning", () => {
    let model = <StatModel>{
        Average: [0, 0],
        SD: 1,
        Warnings: [" "]
    }

    let warning = getWarning(model);
    expect(warning).toBe(" ");

    model.Average = [0, 4];
    warning = getWarning(model);
    expect(warning).toBe("13S")

    model.Average = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    warning = getWarning(model);
    expect(warning).toBe("8X")
});

test("Append Statistics Model", () => {
    const model = <StatModel>{
        Average: [0],
        Date: [""],
        SD: 5,
        Warnings: [" "]
    }
    const model2 = <StatModel>{
        Average: [16],
        Date: [""],
        SD: 2,
        Warnings: [" "]
    }
    const result = appendStatModel(model, model2);

    expect(result.Average.length).toBe(2);
    expect(result.SD).toBe(5);
    expect(result.Warnings[1]).toBe("13S");
})

test("Append New Models", () => {
    const model1 = <StatModel>{
        Average: [0],
        TestName: "Test",
        SD: 1,
        Warnings: [" "],
        Date: [""],
        SampleType: SampleType.Lvl1
    }
    const model2 = <StatModel>{
        Average: [4],
        TestName: "Test",
        SD: 4,
        Warnings: [" "],
        Date: [" "],
        SampleType: SampleType.Lvl1
    }

    const models = appendNewModels([model1], [model2]);

    expect(models.length).toBe(1);
    expect(models[0].Average.length).toBe(2);
    expect(models[0].Warnings[1]).toBe("13S");
})

test("Get Test Value", () => {
    const value = getTestValue(sheet, 0, 0);

    expect(value).toBe(1);

    expect(() => getTestValue(sheet, 1, 0))
        .toThrowError(FailedToParseError);

    expect(() => getTestValue(sheet, 0, 1))
        .toThrowError(XlsxFailedToGetCellError);
})

test("Get Test Title", () => {
    const value1 = getTestTitle(sheet, 1, 0);
    expect(value1).toBe("string");

    const value2 = getTestTitle(sheet, 2, 0);
    expect(value2).toBe("");

    expect(() => getTestTitle(sheet, 0, 1))
        .toThrowError(XlsxFailedToGetCellError);
})

test("Get Results", () => {
    const sheet1: Sheet = {
        ["G3"]: <CellObject>{ v:"Test" },
        ["G4"]: <CellObject>{ v: 2 },
        "!ref": "A1:G4",
    }

    const range1 = utils.decode_range(sheet1["!ref"] || "");
    const result1 = getTestResults(sheet1, range1, 3);

    expect(result1["Test"]).toBe(2);

    expect(() => getTestResults(sheet1, range1, 4))
        .toThrowError(XlsxFailedToGetCellError);

    const sheet2: Sheet = {};
    const range2 = utils.decode_range(sheet2["!ref"] || "");
    const result2 = getTestResults(sheet2, range2, 0);
    expect(result2).toBeTruthy();
});

test("Get Sample Type", () => {
    const sheet: Sheet = {
        ["D1"]: <CellObject>{ v: "QC LV I" },
        ["D2"]: <CellObject>{ v: "qC lV Ii"},
        "!ref": "A1:D2"
    }

    const sampleType1 = getSampleType(sheet, 0);
    const sampleType2 = getSampleType(sheet, 1);

    expect(sampleType1).toBe(SampleType.Lvl1);
    expect(sampleType2).toBe(SampleType.Lvl2);

    expect(() => getSampleType(sheet, 2))
        .toThrowError(XlsxFailedToGetCellError);
})

test("Get Failed Tests", () => {
    const sheet: Sheet = {
        ["F1"]: <CellObject>{ v: "Test,Test2,Test3" },
        ["F2"]: <CellObject>{ v: "" },
        "!ref": "A1:F2"
    }

    const failedTest1 = getFailedTests(sheet, 0);
    const failedTest2 = getFailedTests(sheet, 1);

    expect(failedTest1.length).toBe(3);
    expect(failedTest2.length).toBe(1);

    expect(() => getFailedTests(sheet, 2))
        .toThrowError(XlsxFailedToGetCellError);
})

test("Get Date", () => {
    const date1 = getDate("sdgsgsd20_10_12sdfsdfhsdfh");
    expect(date1).toBe(moment("20_10_12", "DD_MM_YY").toDate().toUTCString());

    const date2 = getDate("12_dfsd09_dss21");
    expect(date2).toBe(new Date().toUTCString());
})

const modelSheet: Sheet = {
    ["F5"]: <CellObject>{ v: "Failed Test" },
    ["G3"]: <CellObject>{ v: "Test" },
    ["H3"]: <CellObject>{ v: "Failed Test" },
    ["G5"]: <CellObject>{ v: 1 },
    ["H5"]: <CellObject>{ v: 0 },
    ["D5"]: <CellObject>{ v: "QC lV II" },
    "!ref": "A1:H5"
}

test("Get Model", () => {
    const range = utils.decode_range(modelSheet["!ref"] || "");
    const model = getModel(modelSheet, 4, range, "File 20_10_20");

    expect(model.SampleType).toBe(SampleType.Lvl2);
    expect(model.Date[0]).toBe(moment("20_10_20", "DD_MM_YY")
        .toDate().toUTCString())
    expect(model.FailedTests[0]).toBe("Failed Test");
    expect(model.TestResults["Test"]).toBe(1);
    expect(model.TestResults["Failed Test"]).toBe(0);

    expect(() => getModel(modelSheet, 5, range, "File"))
        .toThrowError(XlsxFailedToGetCellError);
})

test("Get Models", () => {
    const models = getModels(modelSheet, "File 20_10_20");

    expect(models.length).toBe(1);
})