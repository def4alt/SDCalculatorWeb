const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

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
        new WebpackManifestPlugin(),
    ],
    optimization: {
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                include: /src/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
});
