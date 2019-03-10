const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // entry: path.join(__dirname, 'index.js'),
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js"
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  plugins: [],
  output: {
    filename: "bundle.js",
    path: __dirname
  },
  devServer: {
    compress: true,
    disableHostCheck: true
  }
};
