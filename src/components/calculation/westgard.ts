export default class Westgard {
    public averageValues: number[] = [0];
    public sd: number = 0;


    check(averageValues: number[], sd: number): string {
        this.averageValues = averageValues;
        this.sd = sd;

        for (let i = 1; i < this.averageValues.length; i++) {
            const numbersLeft = this.averageValues.length - i;

            if (numbersLeft >= 8 && this.Rule8X(i))
                return "8X";

            if (numbersLeft >= 4 && this.Rule41S(i))
                return "41S";

            if (numbersLeft >= 2) {
                if (this.Rule22S(i)) return "22S";
                else if (this.RuleR4S(i)) return "R4S";
            }

            if (this.Rule13S(i))
                return "13S";
        }

        return " ";
    }

    isValueExceedsPlus2SD(value: number): boolean {
        return value > this.averageValues[0] + 2 * this.sd;
    };

    isValueExceedsMinus2SD(value: number): boolean {
        return value < this.averageValues[0] - 2 * this.sd;
    };

    Rule22S(index: number): boolean {
        return (this.isValueExceedsPlus2SD(this.averageValues[index]) &&
            this.isValueExceedsPlus2SD(this.averageValues[index + 1])) ||
            (this.isValueExceedsMinus2SD(this.averageValues[index]) &&
                this.isValueExceedsMinus2SD(this.averageValues[index + 1]));
    }

    Rule13S(index: number): boolean {
        return this.averageValues[index] > this.averageValues[0] + 3 * this.sd ||
            this.averageValues[index] < this.averageValues[0] - 3 * this.sd;
    }

    RuleR4S(index: number): boolean {
        return (this.isValueExceedsPlus2SD(this.averageValues[index]) &&
            this.isValueExceedsMinus2SD(this.averageValues[index + 1]) ||
            (this.isValueExceedsMinus2SD(this.averageValues[index]) &&
                this.isValueExceedsPlus2SD(this.averageValues[index + 1])));
    }

    Rule8X(index: number): boolean {
        let numOfPlusExceeds = 0;
        let numOfMinusExceeds = 0;
        for (let i = 0; i < 8; i++) {
            if (this.averageValues[index + i] > this.averageValues[0])
                numOfPlusExceeds += 1;
            else numOfMinusExceeds += 1;
        }

        return numOfMinusExceeds === 8 || numOfPlusExceeds === 8;
    }

    Rule41S(index: number): boolean {
        let numOfPlusExceeds = 0;
        let numOfMinusExceeds = 0;
        for (let i = 0; i < 4; i++) {
            if (this.averageValues[index + i] > this.averageValues[0] + this.sd)
                numOfPlusExceeds += 1;
            else if (
                this.averageValues[index + i] <
                this.averageValues[0] - this.sd
            )
                numOfMinusExceeds += 1;
        }

        return numOfMinusExceeds === 4 || numOfPlusExceeds === 4;
    }
}