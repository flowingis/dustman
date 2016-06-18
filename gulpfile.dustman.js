'use strict';

/*
  D U S T M A N
  0.7.34

  A Gulp 4 automation boilerplate
  by https://github.com/vitto
*/

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    csslint      = require('gulp-csslint'),
    sass         = require('gulp-sass'),
    less         = require('gulp-less'),
    rename       = require('gulp-rename'),
    sourcemaps   = require('gulp-sourcemaps'),
    stylestats   = require('gulp-stylestats'),
    uglify       = require('gulp-uglify'),
    twig         = require('gulp-twig'),
    uglifyCss    = require('gulp-uglifycss'),
    prettify     = require('gulp-html-prettify'),
    moment       = require('moment'),
    sequence     = require('run-sequence'),
    exec         = require('child_process').exec,
    fs           = require('fs'),
    faker        = require('faker'),
    browserSync  = require('browser-sync');


var config = (function(){
  var colors = require('colors');
  var fs = require('fs');
  var yaml = require('js-yaml');
  var merge = require('merge');

  var configFile = 'dustman.yml';

  var data = {
    config: {
      autoprefixer: {
        browsers: [
          'last 3 versions'
        ]
      },
      faker: {
        locale: 'en'
      },
      prettify: {
        indent_char: ' ',
        indent_size: 2
      },
      twig: {
        cache: false
      },
      verbose: 3
    },
    tasks: [
      'css:build',
      'js:build',
      'html:build'
    ]
  };

  var configFileExists = function(configFile) {
    try {
      fs.accessSync(configFile, fs.F_OK);
      return true;
    } catch (e) {
      console.log(colors.red('Error: config file ') + colors.yellow(configFile) + colors.red(' NOT found'));
      process.exit();
    }
  };

  var checkDefaultConfig = function(loadedConfig, configFile){
    if (!loadedConfig) {
      configFileExists(configFile);
      loadedConfig = yaml.safeLoad(fs.readFileSync(configFile, 'utf-8'));
    }
  };

  var checkArguments = function(){
    var loadedConfig = false;
    for (var i = 0; i < process.argv.length; i += 1) {
      if (process.argv[i] === '--config' && process.argv[i + 1] !== undefined) {
        configFile = process.argv[i + 1];
        configFileExists(configFile);
        loadedConfig = yaml.safeLoad(fs.readFileSync(configFile, 'utf-8'));
      }
    }
    checkDefaultConfig(loadedConfig, configFile);
    data = merge.recursive(true, data, loadedConfig);
  };

  var ifProp = function(propName) {
    return typeof data[propName] !== 'undefined' ? true : false;
  };

  return {
    file: function() {
      return configFile;
    },
    get: function(propName){
      if (!ifProp(propName)) {
        console.log(colors.red('Error: property ') + colors.yellow(propName) + colors.red(' NOT found in ') + colors.yellow(configFile));
        process.exit();
      }
      return data[propName];
    },
    if: function(propName){
      return ifProp(propName);
    },
    load: function(){
      checkArguments();
    }
  };
})();


var message = (function(){
  var colors = require('colors');

  var phrases = {
    add: [
      'What the hell is %file%?? I, DUSTMAN will do something to solve this situation...',
      'I\'ve found a sensational discovery, %file% is alive!',
      'Hey %file%, welcome to da build',
      'File %file% detected. Updating the build.'
    ],
    change: [
      'Hey, something\'s happened to %file%, this is a work for DUSTMAN...',
      'Dear %file%, do you really though I wouldn\'t noticed you? Hahaha!',
      'Aha! %file%! You are under build!',
    ],
    unlink: [
      'We have lost %file%, this is a work for DUSTMAN...',
      'Oh my god... %file%... Nooooo!',
      'Another good %file% gone... I will avange you...',
    ]
  };

  var isVerboseEnough = function(verbosity) {
    return config.get('config').verbose >= verbosity;
  };

  var log = function(level, message) {
    if (isVerboseEnough(level)) {
      console.log(message);
    }
  };

  var logReturn = function() {
    log(3, '');
  };

  return {
    speak: function(message) {
      log(2, message);
    },
    verbose: function(title, message) {
      if (typeof message !== 'undefined') {
        log(3, colors.blue(title.trim() + ': ') + message.trim());
      } else {
        log(3, colors.blue(title.trim()));
      }
    },
    warning: function(message){
      log(2, colors.yellow('Warning: ') + message.trim());
    },
    error: function(message) {
      log(0, colors.red('Error: ') + message.trim());
    },
    event: function(eventType, file) {
      var min, max, phrase, splitPhrase, index;
      min = 1;
      max = phrases[eventType].length;
      index = (Math.floor(Math.random() * (max - min + 1)) + min) - 1;
      phrase = phrases[eventType][index];
      splitPhrase = phrase.split('%file%');
      log(1, colors.magenta(splitPhrase[0]) + file + colors.magenta(splitPhrase[1]));
      logReturn();
    }
  };
})();


config.load();
message.verbose('Config loaded', config.file());
