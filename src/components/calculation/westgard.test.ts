import Westgard from "./westgard";

const westgard = new Westgard();

test("13S Rule Check", () => {
    expect(westgard.check([0, 4], 1)).toBe("13S");
})

test("R4S Rule Check", () => {
    expect(westgard.check([0, 3, -3], 1)).toBe("R4S");
})

test("22S Rule Check", () => {
    expect(westgard.check([0, 3, 3], 1)).toBe("22S");
})

test("41S Rule Check", () => {
    expect(westgard.check([0, 2, 2, 2, 2], 1)).toBe("41S");
})

test("8X Rule Check", () => {
    expect(westgard.check([0, 1, 1, 1, 1, 1, 1, 1, 1], 1)).toBe("8X");
})

test("No Warning Check", () => {
    expect(westgard.check([0, 0], 1)).toBe(" ");
})
