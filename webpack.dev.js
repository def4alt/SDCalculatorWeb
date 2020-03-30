const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        historyApiFallback: true,
        hot: true // enable HMR on the server
    },
    devtool: "cheap-module-eval-source-map",
    plugins: [
        new Dotenv({
            path: "./.env"
        }),
        new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new webpack.NamedModulesPlugin() // prints more readable module names in the browser console on HMR updates
    ],
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                include: /src/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    }
});
