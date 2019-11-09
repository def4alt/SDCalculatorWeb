let standardDeviation = 0;
let averageValues = [];

export function CheckValues(AV, SD) {
	standardDeviation = SD;
	averageValues = AV;
	for (let i = 1; i < averageValues.length; i++) {
		if (averageValues.length - i >= 8) {
			if (Rule8X(i)) return "8X";
		} else if (averageValues.length - i >= 4) {
			if (Rule41S(i)) return "41S";
		} else if (averageValues.length - i >= 2) {
			if (Rule22S(i)) return "22S";
			else if (RuleR4S(i)) return "R4S";
		} else if (Rule13S(i)) return "13S";
	}

	return " ";
}

function isValueExceedsPlus(value) {
	if (value > averageValues[0] + 2 * standardDeviation) return true;
	else return false;
}

function isValueExceedsMinus(value) {
	if (value < averageValues[0] - 2 * standardDeviation) return true;
	else return false;
}

function Rule22S(index) {
	if (
		(isValueExceedsPlus(averageValues[index]) &&
			isValueExceedsPlus(averageValues[index + 1])) ||
		(isValueExceedsMinus(averageValues[index]) &&
			isValueExceedsMinus(averageValues[index + 1]))
	)
		return true;
	else return false;
}

function Rule13S(index) {
	if (
		averageValues[index] > averageValues[0] + 3 * standardDeviation ||
		averageValues[index] < averageValues[0] - 3 * standardDeviation
	)
		return true;
	else return false;
}

function RuleR4S(index) {
	if (
		(isValueExceedsPlus(averageValues[index]) &&
			isValueExceedsMinus(averageValues[index + 1])) ||
		(isValueExceedsMinus(averageValues[index]) &&
			isValueExceedsPlus(averageValues[index + 1]))
	)
		return true;
	else return false;
}

function Rule8X(index) {
	let numOfPlusExceeds = 0;
	let numOfMinusExceeds = 0;
	for (let i = 0; i < 8; i++) {
		if (averageValues[index + i] > averageValues[0]) numOfPlusExceeds += 1;
		else numOfMinusExceeds += 1;
	}

	if (numOfMinusExceeds === 8 || numOfPlusExceeds === 8) return true;
	else return false;
}

function Rule41S(index) {
	let numOfPlusExceeds = 0;
	let numOfMinusExceeds = 0;
	for (let i = 0; i < 4; i++) {
		if (averageValues[index + i] > averageValues[0] + standardDeviation)
			numOfPlusExceeds += 1;
		else if (
			averageValues[index + i] <
			averageValues[0] - standardDeviation
		)
			numOfMinusExceeds += 1;
	}
	console.log(numOfMinusExceeds);
	console.log(numOfPlusExceeds);

	if (numOfMinusExceeds === 4 || numOfPlusExceeds === 4) return true;
	else return false;
}
