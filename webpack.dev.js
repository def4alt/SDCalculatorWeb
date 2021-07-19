const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "./dist"),
        compress: true,
        hot: true,
        port: 8080,
    },
    devtool: "eval-cheap-module-source-map",
    plugins: [new webpack.HotModuleReplacementPlugin()],
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
