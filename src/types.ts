import { CellObject } from "xlsx";

export enum SampleType {
    Null = 0,
    Lvl1 = 1,
    Lvl2 = 2
}

export interface Dictionary<T> {
    [x: string]: T;
}

export type ReadModel = {
    SampleType: SampleType;
    FailedTests: Array<string>;
    TestResults: Dictionary<number>;
    Date: Array<string>;
};

export type StatModel = {
    Average: number[];
    SD: number;
    TestName: string;
    SampleType: SampleType;
    Date: Array<string>;
    Warnings: Array<string>;
};

export interface VerifiedCellObject extends CellObject {
    v: string | number | boolean | Date
}

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
    name: string

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