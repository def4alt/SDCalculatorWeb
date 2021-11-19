const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    experiments: {
        asset: true,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".json", ".js", ".jsx", ".scss"],
        alias: {
            Styles: path.resolve(__dirname, "src/styles/"),
            Context: path.resolve(__dirname, "src/context/"),
            Components: path.resolve(__dirname, "src/components/"),
        },
    },
    module: {
        rules: [
            {
                include: /src/,
                test: /\.(ts|tsx)$/,
                exclude: /\.test$/,
                use: ["babel-loader", "ts-loader"],
            },
            {
                test: /\.(jpg|png)$/,
                include: /public\//,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                    },
                },
            },
            {
                exclude: /node_modules/,
                test: /\.html$/i,
                loader: "html-loader",
            },
        ],
    },
    plugins: [
        new DotEnv({
            path: "./.env",
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html"),
            favicon: path.resolve(__dirname, "public", "favicon.ico"),
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true,
            },
            inject: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "public/logo192.png", to: "assets/logo192.png" },
                { from: "public/logo512.png", to: "assets/logo512.png" },
            ],
        }),
    ],
};
