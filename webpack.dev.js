const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        historyApiFallback: true,
        hot: true // enable HMR on the server
    },
    devtool: "cheap-module-eval-source-map",
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    ],
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                include: /src/,
                use: ["style-loader", "css-loader", {
                    loader: 'sass-loader',
                    options: {
                        implementation: require('sass'),
                    }}]
            }
        ]
    }
});
