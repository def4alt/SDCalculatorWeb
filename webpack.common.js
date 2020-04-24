const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const { CheckerPlugin } = require("awesome-typescript-loader");
const ManifestPlugin = require("webpack-manifest-plugin");

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
            },
            {
                exclude: /node_modules/,
                test: /\.json$/i,
                loader: "json-loader"
            }
        ]
    },
    plugins: [
        new DotEnv({
            path: "./.env"
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html"),
            favicon: path.resolve(__dirname, "public", "favicon.ico")
        }),
        new CheckerPlugin(),
        new ManifestPlugin({
            seed: {
                "short_name": "SDCalculator",
                "name": "SDCalculator on Web",
                "icons": [
                    {
                        "src": "favicon.ico",
                        "sizes": "64x64 32x32 24x24 16x16",
                        "type": "image/x-icon"
                    },
                    {
                        "src": "logo192.png",
                        "type": "image/png",
                        "sizes": "192x192"
                    }
                ],
                "start_url": ".",
                "display": "standalone",
                "theme_color": "#000000",
                "background_color": "#ffffff"
            }
        })
    ]
};
