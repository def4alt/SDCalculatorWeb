export enum SampleType {
    Null = 0,
    Lvl1 = 1,
    Lvl2 = 2
}

interface Dictionary<T> {
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

export type BackupModel = {
    Lot: string;
    StatModels: StatModel[];
};
