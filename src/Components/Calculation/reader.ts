import {Sheet, read, utils} from "xlsx";
import SampleType from "./SampleType";
import moment from "moment";

const getValueFromCell = (r: number, c: number, sheet: Sheet) => {
	return sheet[
		utils.encode_cell({
			r: r,
			c: c
		})
	];
};

function Read(file: File) {
	const result = new Promise(resolve => {
		const reader = new FileReader();
		reader.readAsBinaryString(file);
		reader.onload = () => {
			const models = [];

			var dateString: string = String(file.name)
				.replace("Summary Report", "")
				.replace("-", "")
				.replace(".wiff", "")
				.replace(".xls", "")
				.replace("_", "/")
				.replace("_", "/")
				.trim();

			var date: Date = moment(
				moment(dateString, "DD/MM/YY")
					.toDate()
					.toUTCString()
			).toDate();

			dateString = date
				? date.toLocaleString("en-GB", {
						day: "2-digit",
						year: "2-digit",
						month: "2-digit"
				  })
				: moment(new Date().toUTCString())
						.toDate()
						.toLocaleString("en-GB", {
							day: "2-digit",
							year: "2-digit",
							month: "2-digit"
						});

			const workbook = read(reader.result, {
				type: "binary"
			});

			const sheet = workbook.Sheets[workbook.SheetNames[0]];

			const columnTitleRow = 2;

			const range = utils.decode_range(sheet["!ref"] || "");
			for (let rowNum = range.s.r + 4; rowNum <= range.e.r; rowNum++) {
				const sampleTypeCell = getValueFromCell(rowNum, 3, sheet);

				if (sampleTypeCell == null) {
					continue;
				}

				const failedTestsCell = getValueFromCell(rowNum, 5, sheet);

				const sampleType =
					sampleTypeCell.v.trim() === "QC Lv I"
						? SampleType.Lvl1
						: sampleTypeCell.v.trim() === "QC LV II"
						? SampleType.Lvl2
						: SampleType.Null;

				const failedTests = String(failedTestsCell.v).split(",");

				const testResults: { [x: string]: number } = {};

				for (let col = range.s.c + 6; col <= range.e.c; col++) {
					const testValueCell = getValueFromCell(rowNum, col, sheet);
					let testValue = parseFloat(testValueCell.v);
					if (isNaN(testValue)) testValue = 0;

					const testNameCell = getValueFromCell(
						columnTitleRow,
						col,
						sheet
					);
					const testName = String(testNameCell.v).trim();

					if (!testName.includes("/")) {
						testResults[testName] =
							Math.round(testValue * 100) / 100;
					}
				}
				const model = {
					SampleType: sampleType,
					FailedTests: failedTests,
					TestResults: testResults,
					Date: [dateString]
				};

				models.push(model);
			}

			resolve(models);
		};
	});

	return result;
}

export default Read;

export type ReadModel = {
	SampleType: SampleType;
	FailedTests: string[];
	TestResults: { [x: string]: number };
	Date: string[];
};
