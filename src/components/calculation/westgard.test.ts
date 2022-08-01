import { checkWestgardViolations } from "./westgard";

describe("westgard", () => {
    test("13S Rule Check", () => {
        expect(checkWestgardViolations([0, 3.5], 0, 1)[1]).toBe("13S");
    });

    test("R4S Rule Check", () => {
        expect(checkWestgardViolations([0, 3, -3], 0, 1)[2]).toBe("R4S");
    });

    test("22S Rule Check", () => {
        expect(checkWestgardViolations([0, 3, 3], 0, 1)[2]).toBe("22S");
    });

    test("41S Rule Check", () => {
        expect(checkWestgardViolations([0, 2, 2, 2, 2], 0, 1)[4]).toBe("41S");
    });

    test("8X Rule Check", () => {
        expect(
            checkWestgardViolations([0, 1, 2, 3, 4, 5, 6, 7, 8], 0, 1)[7]
        ).toBe("8X");
    });

    test("No Warning Check", () => {
        expect(checkWestgardViolations([0, 0], 0, 1)[1]).toBe("");
    });
});
