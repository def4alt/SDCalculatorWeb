const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
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
                exclude: /node_modules/,
                test: /\.(jpeg|png|svg)$/i,
                loader: "file-loader",
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
        new WebpackPwaManifest({
            short_name: "SDCalculator",
            name: "SDCalculator on Web",
            ios: true,
            inject: true,
            icons: [
                {
                    src: path.resolve(__dirname, "public", "favicon.ico"),
                    sizes: [64, 32, 24, 16],
                },
                {
                    src: path.resolve(__dirname, "public", "logo192.png"),
                    sizes: [192, 180],
                    ios: true,
                },
                {
                    src: path.resolve(__dirname, "public", "logo512.png"),
                    size: "512x512",
                },
            ],
            start_url: ".",
            display: "standalone",
            theme_color: "#0984e3",
            background_color: "#ffffff",
        }),
        new WorkboxPlugin.GenerateSW(),
    ],
};
