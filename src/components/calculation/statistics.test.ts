import getStatModels, { getAverageFor, getModel, getNonFailedResults, getStandardDeviation } from "./statistics";
import { Dictionary, InvalidArgumentError, ReadModel, SampleType } from "../../types";

const model1: ReadModel = {
    SampleType: SampleType.Lvl1,
    FailedTests: ["Failed Test"],
    TestResults: <Dictionary<number>>{
        ["Test"]: 10,
        ["Failed Test"]: 10
    },
    Date: ["10/20/20"]
}

const model2: ReadModel = {
    SampleType: SampleType.Lvl1,
    FailedTests: ["Failed Test"],
    TestResults: <Dictionary<number>>{
        ["Test"]: 30,
        ["Failed Test"]: 2
    },
    Date: ["4/10/20"]
}

const model3: ReadModel = {
    SampleType: SampleType.Lvl2,
    FailedTests: ["Failed Test"],
    TestResults: <Dictionary<number>>{
        ["Test"]: 20,
        ["Failed Test"]: 5
    },
    Date: ["5/20/10"]
}

const model4: ReadModel = {
    SampleType: SampleType.Lvl2,
    FailedTests: ["Failed Test"],
    TestResults: <Dictionary<number>>{
        ["Test"]: 50,
        ["Failed Test"]: 1
    },
    Date: ["2/1/20"]
}

test("Get Non Failed Tests", () => {
    const failed = getNonFailedResults([model1, model2], "Failed Test");
    const passed = getNonFailedResults([model1, model2], "Test");

    expect(failed.length).toBe(0);
    expect(passed.length).toBe(2);
})

test("Get Average", () => {
    const nonFailedResults = getNonFailedResults([model1, model2], "Test").map(
        (t) => t.TestResults["Test"]
    );

    const failedAverage = getAverageFor([]);
    const expectedAverage = getAverageFor(nonFailedResults)

    expect(failedAverage).toBe(0);
    expect(expectedAverage).toBe(20);
})

test("Get Standard Deviation", () => {
    const nonFailedResults = getNonFailedResults([model1, model2], "Test").map(
        (t) => t.TestResults["Test"]
    );

    const failedSD = getStandardDeviation([]);
    const expectedSD = getStandardDeviation(nonFailedResults)

    expect(failedSD).toBe(0);
    expect(expectedSD).toBe(10);
})


test("Get Statistics Model", () => {
    const statModel1 =
        getModel([model1, model2, model3, model4], "Test", SampleType.Lvl1);

    expect(statModel1.Average[0]).toBe(20);

    try {
        getModel([model1, model2, model3, model4], "", SampleType.Lvl2);
    }
    catch (e) {
        expect<InvalidArgumentError>(e);
    }

    try {
        getModel([], "Failed Test", SampleType.Lvl1);
    }
    catch (e) {
        expect<InvalidArgumentError>(e);
    }
})

test("Get Statistics Models", () => {
    const statModels = getStatModels([model1, model2, model3, model4]);

    expect(statModels.length).toBe(2);

    const statModels1 = getStatModels([]);

    expect(statModels1.length).toBe(0)

})