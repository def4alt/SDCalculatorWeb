const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].bundle.js",
    },
    plugins: [
        new CleanWebpackPlugin(),
        new LodashModuleReplacementPlugin(),
        new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    ],
    optimization: {
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                include: /src/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            additionalData: '@use "Styles/base";',
                        },
                    },
                ],
            },
        ],
    },
});
