import { processData } from "./processor";

describe("processor", () => {
    test("Process data", () => {
        expect(processData([]).length).toBe(0);
    });
});
