const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        historyApiFallback: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    devtool: "eval-cheap-module-source-map",
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                include: /src/,
                use: [
                    "style-loader",
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
