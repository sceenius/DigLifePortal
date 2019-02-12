const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    //new VueLoaderPlugin()
  ],
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  devServer: {
	  compress: true,
	  disableHostCheck: true
  }
};
