'use strict';

var gulp = require('gulp');
var HubRegistry = require('gulp-hub');

var hub = new HubRegistry(['tasks/*.js']);

gulp.registry(hub);
