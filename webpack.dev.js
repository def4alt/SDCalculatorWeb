const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    historyApiFallback: true,
    hot: true // enable HMR on the server
  },
  devtool: "cheap-module-eval-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin() // prints more readable module names in the browser console on HMR updates
  ],
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  }
});
