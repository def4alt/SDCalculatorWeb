const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");

module.exports = merge(common, {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].bundle.js",
    },
    plugins: [
        new CleanWebpackPlugin(),
        new LodashModuleReplacementPlugin(),
        new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
        new WebpackManifestPlugin(),
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
    optimization: {
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                include: /src/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
});
