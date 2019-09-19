import SampleType from './SampleType';

class TestModel {
    public SampleType: SampleType;
    public FailedTests: string[];
    public TestResults: {
        [id: string]: number;
    };

    constructor() {
        this.SampleType = SampleType.Null;
        this.FailedTests = new Array<string>();
        this.TestResults = {};
    }
}

export default TestModel;
