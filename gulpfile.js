var gulp = require('gulp');
var clean = require('gulp-clean');
var _ = require('lodash');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

gulp.task('clean', function () {
  return gulp
    .src('dist', {
      allowEmpty: true,
      read: false
    })
    .pipe(clean());
});

gulp.task('webpack-dev-server', function (callback) {
  var config = require('./build/webpack.development.conf.js');
  _.each(config.entry, function (ent) {
    var hotClientEntry = 'webpack-dev-server/client?http://localhost:' + config.devServer.port;
    var hotServerEntry = 'webpack/hot/dev-server';
    if (ent instanceof Array) {
      ent.unshift(hotClientEntry, hotServerEntry);
    } else {
      ent = [ent, hotClientEntry, hotServerEntry];
    }
  });
  var compiler = webpack(config);
  var server = new WebpackDevServer(compiler, compiler.options.devServer);

  server.listen(config.devServer.port, 'localhost', function (err) {
    callback();
  });
});

gulp.task('webpack:production', function (callback) {
  webpack(require('./build/webpack.production.conf.js'), function () {
    callback();
  });
});

var dev = gulp.series('clean', 'webpack-dev-server');
var buildProduction = gulp.series('clean', 'webpack:production');

gulp.task('default', dev);
gulp.task('build:production', buildProduction);
