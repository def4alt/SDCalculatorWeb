const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const { CheckerPlugin } = require("awesome-typescript-loader");
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    resolve: {
        extensions: [".ts", ".tsx", ".json", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                include: /src/,
                test: /\.(ts|tsx)$/,
                use: ["babel-loader", "awesome-typescript-loader"]
            },
            {
                exclude: /node_modules/,
                test: /\.(jpeg|png|svg)$/i,
                loader: "file-loader"
            },
            {
                exclude: /node_modules/,
                test: /\.html$/i,
                loader: "html-loader"
            }
        ]
    },
    plugins: [
        new DotEnv({
            path: "./.env"
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html")
        }),
        new CheckerPlugin(),
        new ManifestPlugin()
    ]
};
