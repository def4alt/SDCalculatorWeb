export enum SampleType {
    Null = 0,
    Lvl1 = 1,
    Lvl2 = 2,
}

export interface Dictionary<T> {
    [x: string]: T;
}

export type RawData = {
    SampleType: SampleType;
    FailedTests: Array<string>;
    TestResults: Dictionary<number>;
    Dates: Array<Date>;
};

export type ProcessedData = {
    Values: number[];
    SD: number;
    TestName: string;
    SampleType: SampleType;
    Dates: Array<Date>;
    Warnings: Array<string>;
};

export class CalculationError implements Error {
    message: string;
    name: string;

    constructor(message: string = "", name: string = "") {
        this.message = message;
        this.name = name;
    }
}

export class InvalidArgumentError implements Error {
    message: string;
    name: string;

    constructor(message: string = "", name: string = "") {
        this.message = message;
        this.name = name;
    }
}

export class XlsxFailedToGetCellError implements Error {
    message: string;
    name: string;

    constructor(message: string = "", name: string = "") {
        this.message = message;
        this.name = name;
    }
}

export class FailedToParseError implements Error {
    message: string;
    name: string;

    constructor(message: string = "", name: string = "") {
        this.message = message;
        this.name = name;
    }
}
