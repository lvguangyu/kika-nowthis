var path = require('path');
var webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
  entry: {
    vendors: ['vue', 'vue-resource', 'vue-infinite-scroll'],
    index: path.resolve(__dirname, '../app/src/index.js'),
    video: path.resolve(__dirname, '../app/src/video.js')
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(vue|js)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.(png|jpe?g|gif)(\?\S*)?$/,
      loader: 'file-loader',
      query: {
        name: 'images/[name].[ext]?[hash]'
      }
    }]
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../app/src')
    ],
    alias: {
      'config$': path.join(__dirname, '../app/src/config', process.env.NODE_ENV || 'development'),
      'jquery$': 'jquery/src/jquery.js'
    }
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        sassLoader: {
          includePaths: [path.join(__dirname, '../app/sass')].concat(require('bourbon').includePaths)
        },
        context: '/'
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendors', 'misc']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor', 'misc']
    })
  ]
};
