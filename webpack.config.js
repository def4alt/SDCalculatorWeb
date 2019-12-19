const path = require("path"),
	webpack = require("webpack"),
	HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

module.exports = {
	entry: "./src/index.tsx",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].bundle.js"
	},
	devServer: {
		historyApiFallback: true,
		hot: true
	},
	devtool: "source-map",
	resolve: {
		extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
	},
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.(ts|tsx)$/,
				loader: "ts-loader"
			},
			{
				enforce: "pre",
				exclude: /node_modules/,
				test: /\.js$/,
				loader: "source-map-loader"
			},
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
				use: ["file-loader?name=[name].[ext]"] // ?name=[name].[ext] is only necessary to preserve the original file name,
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "public", "index.html"),
			favicon: path.resolve(__dirname, "public", "favicon.ico"),
			minify: {
				collapseWhitespace: true,
				collapseInlineTagWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				minifyJs: true,
				minifyCss: true
			}
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new LodashModuleReplacementPlugin()
	]
};
