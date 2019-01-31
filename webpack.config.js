const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development', // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  // "production": enable many optimizations for production builds
  // "development": enabled useful tools for development
  // "none": no defaults
  entry: './index.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin()
  ],
  node: {
    fs: 'empty',
    tls: 'empty',
    net: 'empty'
  }
}
