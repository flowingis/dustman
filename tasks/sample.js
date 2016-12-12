'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');


gulp.task('sample', function(done) {
  gutil.log('here i am');
  gutil.log(__dirname);
  done();
});
