var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'javascripts/[name].[chunkhash:8].js',
    chunkFilename: 'javascripts/[id].[chunkhash:8].js',
    publicPath: '//'
  },
  devtool: 'source-map'
});

webpackConfig.module.rules = webpackConfig.module.rules.concat([{
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
      sass: ExtractTextPlugin.extract({
        loader: ['css-loader?sourceMap', 'sass-loader?sourceMap']
      })
    }
  }
}, {
  test: /\.css$/,
  loader: ExtractTextPlugin.extract('css-loader?sourceMap')
}, {
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract('css-loader?sourceMap!sass-loader?sourceMap')
}]);

webpackConfig.plugins = webpackConfig.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': '"production"'
    }
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    }
  }),
  new ExtractTextPlugin({
    filename: 'stylesheets/[name].[contenthash:8].css',
    allChunks: true
  }),
  new HtmlWebpackPlugin({
    title: '',
    template: 'app/index.html',
    filename: 'index.html',
    chunks: ['vendors', 'manifest', 'index'],
    minify: {
      removeComments: true,
      collapseWhitespace: true
    },
    chunksSortMode: 'dependency'
  }),
  new HtmlWebpackPlugin({
    title: '',
    template: 'app/index.html',
    filename: 'video.html',
    chunks: ['vendors', 'manifest', 'video'],
    minify: {
      removeComments: true,
      collapseWhitespace: true
    },
    chunksSortMode: 'dependency'
  })
]);

module.exports = webpackConfig;
