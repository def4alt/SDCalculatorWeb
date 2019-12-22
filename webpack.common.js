const path = require("path");

module.exports = {
	entry: path.resolve(__dirname, "src", "index.tsx"),
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".json"]
	},
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.(ts|tsx)$/,
				loader: "ts-loader"
			},
			{
				exclude: /node_modules/,
				test: /\.html$/,
				use: [
					{
						loader: "html-loader"
					}
				]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
				exclude: /node_modules/,
				use: {
					loader: "file-loader",
					options: {
						name: "[name].[hash].[ext]",
						outputPath: "imgs"
					}
				}
			}
		]
	}
};
