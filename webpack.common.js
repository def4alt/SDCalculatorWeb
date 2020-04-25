const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const { CheckerPlugin } = require("awesome-typescript-loader");
const ManifestPlugin = require("webpack-manifest-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");

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
        new ManifestPlugin(),
        new WebpackPwaManifest({
            short_name: "SDCalculator",
            name: "SDCalculator on Web",
            inject: true,
            icons: [
                {
                    src: path.resolve(__dirname, "public", "favicon.ico"),
                    sizes: [64, 32, 24, 16]
                },
                {
                    src: path.resolve(__dirname, "public", "logo192.png"),
                    size: "192x192",
                    ios: true
                },
                {
                    src: path.resolve(__dirname, "public", "logo512.png"),
                    size: "512x512"
                }
            ],
            start_url: ".",
            display: "standalone",
            theme_color: "#000000",
            background_color: "#ffffff"
        })
    ]
};
