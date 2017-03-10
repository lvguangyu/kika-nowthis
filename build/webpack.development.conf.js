var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');

var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var baseWebpackConfig = require('./webpack.base.conf');

var webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'javascripts/[name].js',
    publicPath: '/'
  },
  devtool: 'source-map',
  watch: true,
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    stats: {
      colors: true
    },
    hot: true,
    contentBase: [path.join(__dirname, '../tmp'), path.join(__dirname, '../app'), path.join(__dirname, '../dist')],
    watchContentBase: false,
    port: 3100
  },
  performance: {
    hints: false
  }
});

webpackConfig.module.rules = webpackConfig.module.rules.concat([{
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
      sass: 'vue-style-loader?sourceMap!css-loader?sourceMap!sass-loader?sourceMap'
    }
  }
}, {
  test: /\.css$/,
  loader: ExtractTextPlugin.extract({
    loader: 'css-loader?sourceMap'
  })
}, {
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract({
    loader: 'css-loader?sourceMap!sass-loader?sourceMap'
  })
}, {
  test: /\.json$/,
  loader: 'json-loader'
}]);

webpackConfig.plugins = webpackConfig.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': '"development"'
    }
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    proxy: 'http://localhost:3100/',
    browser: 'Google Chrome Canary',
    open: true
  }, {
    reload: false
  }),
  new HtmlWebpackPlugin({
    title: '',
    themeColor: '#3baa24',
    template: 'app/index.html',
    filename: 'index.html',
    chunks: ['vendors', 'manifest', 'index']
  }), new HtmlWebpackPlugin({
    title: '',
    themeColor: '#3baa24',
    template: 'app/index.html',
    filename: 'video.html',
    chunks: ['vendors', 'manifest', 'video']
  }),
  new ExtractTextPlugin({
    filename: 'stylesheets/[name].css',
    allChunks: true
  })
]);

module.exports = webpackConfig;
