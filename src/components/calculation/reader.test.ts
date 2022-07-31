import {
    appendNewModels,
    appendStatModel,
    getDate,
    getFailedTests,
    getTestResults,
    getSampleType,
    getTestTitle,
    getTestValue,
    getValueFromCell,
    getModel,
    getModels,
} from "./reader";
import { CellObject, Sheet, utils } from "xlsx";
import { SampleType, StatModel } from "../../types";
import moment from "moment";
import { checkWestgardViolations } from "./westgard";

const sheet: Sheet = {
    A1: { v: 1 } as CellObject,
    A2: { v: "string " } as CellObject,
    A3: { v: "string/" } as CellObject,
    "!ref": "A1:B3",
};

test("Get Value From Cell", () => {
    const value = getValueFromCell(0, 0, sheet);
    if (value.isOk()) expect(value.value).toBe(1);

    expect(getValueFromCell(0, 1, sheet).isErr()).toBeTruthy();
});

test("Get Warning", () => {
    let model = {
        Average: [0, 0],
        SD: 1,
        Warnings: [" "],
    } as StatModel;

    let warnings = checkWestgardViolations(
        model.Average,
        model.Average[0],
        model.SD
    );
    expect(warnings[0]).toBe("");

    model.Average = [0, 4];
    warnings = checkWestgardViolations(
        model.Average,
        model.Average[0],
        model.SD
    );
    expect(warnings[1]).toBe("13S");

    model.Average = [0, 1, 1, 1, 1, 1, 1, 1];
    warnings = checkWestgardViolations(
        model.Average,
        model.Average[0],
        model.SD
    );
    expect(warnings[warnings.length - 1]).toBe("8X");
});

test("Append Statistics Model", () => {
    const model = {
        Average: [0],
        Date: [""],
        SD: 5,
        Warnings: [""],
    } as StatModel;
    const model2 = {
        Average: [15.5],
        Date: [""],
        SD: 2,
        Warnings: [""],
    } as StatModel;
    const result = appendStatModel(model, model2);

    expect(result.Average.length).toBe(2);
    expect(result.SD).toBe(5);
    expect(result.Warnings[1]).toBe("13S");
});

test("Append New Models", () => {
    const model1 = {
        Average: [0],
        TestName: "Test",
        SD: 1,
        Warnings: [""],
        Date: [""],
        SampleType: SampleType.Lvl1,
    } as StatModel;
    const model2 = {
        Average: [3.5],
        TestName: "Test",
        SD: 1,
        Warnings: [""],
        Date: [" "],
        SampleType: SampleType.Lvl1,
    } as StatModel;

    const models = appendNewModels([model1], [model2]);

    expect(models.length).toBe(1);
    expect(models[0].Average.length).toBe(2);
    expect(models[0].Warnings[1]).toBe("13S");
});

test("Get Test Value", () => {
    const value = getTestValue(sheet, 0, 0);

    if (value.isOk()) expect(value.value).toBe(1);

    expect(getTestValue(sheet, 1, 0).isErr()).toBeTruthy();

    expect(getTestValue(sheet, 0, 1).isErr()).toBeTruthy();
});

test("Get Test Title", () => {
    expect(getTestTitle(sheet, 1, 0)).toBe("string");

    expect(getTestTitle(sheet, 2, 0)).toBe("");

    expect(getTestTitle(sheet, 0, 1)).toBe("");
});

test("Get Results", () => {
    const sheet1: Sheet = {
        G3: { v: "Test" } as CellObject,
        G4: { v: 2 } as CellObject,
        "!ref": "A1:G4",
    };

    const range1 = utils.decode_range(sheet1["!ref"] || "");
    const result1 = getTestResults(sheet1, range1, 3);

    expect(result1["Test"]).toBe(2);

    const sheet2: Sheet = {};
    const range2 = utils.decode_range(sheet2["!ref"] || "");
    const result2 = getTestResults(sheet2, range2, 5);
    expect(result2).toBeTruthy();
});

test("Get Sample Type", () => {
    const sheet: Sheet = {
        D1: { v: "QC LV I" } as CellObject,
        D2: { v: "qC lV Ii" } as CellObject,
        "!ref": "A1:D2",
    };

    const sampleType1 = getSampleType(sheet, 0);
    const sampleType2 = getSampleType(sheet, 1);

    if (sampleType1.isOk()) expect(sampleType1.value).toBe(SampleType.Lvl1);
    if (sampleType2.isOk()) expect(sampleType2.value).toBe(SampleType.Lvl2);

    expect(getSampleType(sheet, 2).isErr).toBeTruthy();
});

test("Get Failed Tests", () => {
    const sheet: Sheet = {
        F1: { v: "Test,Test2,Test3" } as CellObject,
        F2: { v: "" } as CellObject,
        "!ref": "A1:F2",
    };

    expect(getFailedTests(sheet, 0).length).toBe(3);
    expect(getFailedTests(sheet, 1).length).toBe(1);

    expect(getFailedTests(sheet, 2).length).toBe(0);
});

test("Get Date", () => {
    expect(getDate("sdgsgsd20_10_12sdfsdfhsdfh")).toBe(
        moment("20_10_12", "DD_MM_YY").toDate().toUTCString()
    );

    expect(getDate("12_dfsd09_dss21")).toBe(new Date().toUTCString());
});

const modelSheet: Sheet = {
    F5: { v: "Failed Test" } as CellObject,
    G3: { v: "Test" } as CellObject,
    H3: { v: "Failed Test" } as CellObject,
    G5: { v: 1 } as CellObject,
    H5: { v: 0 } as CellObject,
    D5: { v: "QC lV II" } as CellObject,
    "!ref": "A1:H5",
};

test("Get Model", () => {
    const range = utils.decode_range(modelSheet["!ref"] || "");
    const model = getModel(modelSheet, 4, range, "File 20_10_20");

    expect(model.SampleType).toBe(SampleType.Lvl2);
    expect(model.Date[0]).toBe(
        moment("20_10_20", "DD_MM_YY").toDate().toUTCString()
    );
    expect(model.FailedTests[0]).toBe("Failed Test");
    expect(model.TestResults["Test"]).toBe(1);
    expect(model.TestResults["Failed Test"]).toBe(0);

    expect(getModel(modelSheet, 5, range, "File")).toBeTruthy();
});

test("Get Models", () => {
    const models = getModels(modelSheet, "File 20_10_20");

    expect(models.length).toBe(1);
});
