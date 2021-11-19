const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

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
        new WorkboxPlugin.GenerateSW({
            // Do not precache images
            exclude: [/\.(?:png|jpg|jpeg|svg)$/],
      
            // Define runtime caching rules.
            runtimeCaching: [{
              // Match any request that ends with .png, .jpg, .jpeg or .svg.
              urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
      
              // Apply a cache-first strategy.
              handler: 'CacheFirst',
      
              options: {
                // Use a custom cache name.
                cacheName: 'images',
      
                // Only cache 10 images.
                expiration: {
                  maxEntries: 10,
                }
              }
            }]
          })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                parallel: true,
            }),
        ],
        moduleIds: "deterministic",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                include: /src/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            additionalData: '@use "Styles/base";',
                        },
                    },
                ],
            },
        ],
    },
});
