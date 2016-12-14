'use strict';

const assert = require('assert');
const expect = require('expect');
const fs = require('fs');
const gutil = require('gulp-util');
const path = require('path');

const inputDir = path.join(__dirname, '/../samples/css/');
const outputDir = path.join(__dirname, '/../output/css/');

const csso = require('gulp-csso');
const gulp = require('gulp');

describe('CSS minified with CSSO', function() {

  this.timeout(4000);

  beforeEach(function (done){
    gulp.task('csso', function(done) {
      gulp.src(inputDir + 'csso.css')
        .pipe(csso({
          restructure: true,
          sourceMap: true,
          debug: true
        }))
        .pipe(gulp.dest(outputDir));
      done();
    });
    done();
  });

  it('should create an optimized CSS file with CSSO', function() {
    gulp.series('csso')();
    expect(fs.existsSync(outputDir + 'csso.css')).toBe(true, 'File not found');
  });
});
