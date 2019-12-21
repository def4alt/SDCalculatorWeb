const path = require("path"),
	webpack = require("webpack");
const common = require("./webpack.common");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
	mode: "development",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "main.bundle.js"
	},
	devServer: {
		historyApiFallback: true,
		hot: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "public", "index.html"),
			favicon: path.resolve(__dirname, "public", "favicon.ico")
		})
	],
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.(s*)css$/,
				include: [
					path.resolve(
						__dirname,
						"/node_modules/react-vis/dist/style.css"
					),
					path.resolve(__dirname, "src")
				],
				use: ["style-loader", "css-loader", "sass-loader"]
			}
		]
	}
});
