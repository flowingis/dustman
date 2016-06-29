'use strict';

/*
  D U S T M A N
  {{ version }}

  A Gulp 4 automation boilerplate
  by https://github.com/vitto
*/

var gulp = require('gulp');

    // autoprefixer = require('gulp-autoprefixer'),
    // concat       = require('gulp-concat'),
    // csslint      = require('gulp-csslint'),
    // sass         = require('gulp-sass'),
    // less         = require('gulp-less'),
    // rename       = require('gulp-rename'),
    // sourcemaps   = require('gulp-sourcemaps'),
    // stylestats   = require('gulp-stylestats'),
    // uglify       = require('gulp-uglify'),
    // twig         = require('gulp-twig'),
    // uglifyCss    = require('gulp-uglifycss'),
    // prettify     = require('gulp-html-prettify'),
    // moment       = require('moment'),
    // sequence     = require('run-sequence'),
    // exec         = require('child_process').exec,
    // fs           = require('fs'),
    // faker        = require('faker'),
    // browserSync  = require('browser-sync');

{{ body }}

message.intro();
config.load();
message.verbose('Version', '{{ version }}');
message.verbose('Config loaded', config.file());
tasks.init();
