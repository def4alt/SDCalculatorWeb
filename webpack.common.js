const path = require("path");
const { CheckerPlugin } = require("awesome-typescript-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    resolve: {
        extensions: [".ts", ".tsx", ".json", ".js"]
    },
    module: {
        rules: [
            {
                include: /src/,
                test: /\.(ts|tsx)$/,
                use: ["babel-loader", "awesome-typescript-loader"]
            },
            {
                test: /\.(jpeg|png|svg)$/i,
                loader: "file-loader"
            }
        ]
    },
    plugins: [
        new DotEnv({
            path: "./.env"
        }),
        new CheckerPlugin(),
        new ServiceWorkerWebpackPlugin({
            entry: path.join(__dirname, 'src/serviceWorker.ts'),
            filename: 'serviceWorker.ts'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html")
        })
    ]
};
