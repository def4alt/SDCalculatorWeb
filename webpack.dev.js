const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
const WorkboxPlugin = require("workbox-webpack-plugin");
const path = require("path");
const WebpackPwaManifest = require("webpack-pwa-manifest");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        historyApiFallback: true,
        hot: true,
        open: true,
    },
    devtool: "eval-cheap-module-source-map",
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // enable HMR
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
            theme_color: "#000000",
            background_color: "#ffffff",
        }),
        new WorkboxPlugin.GenerateSW(),
    ],
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
                        },
                    },
                ],
            },
        ],
    },
});
