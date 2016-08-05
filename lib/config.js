
var config = (function(){
  var colour = require('colour');
  var fs = require('fs');
  var yaml = require('js-yaml');
  var merge = require('merge');
  var path = require('path');

  var configFile = 'dustman.yml';
  var nodeMinVersion = false;

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
      polling: false,
      verbose: 3,
      verify: false
    },
    css: {
      file: 'dustman.min.css',
      watch: './**/*.css'
    },
    js: {
      file: 'dustman.min.js',
      watch: './**/*.js'
    },
    html: {
      engine: 'html'
    },
    paths: {
      css: 'dustman/css/',
      fonts: 'dustman/fonts/',
      images: 'dustman/img/',
      js: 'dustman/js/',
      server: 'dustman/'
    },
    tasks: [
      'css',
      'js',
      'html'
    ]
  };

  var configFileExists = function(configFile) {
    try {
      fs.accessSync(configFile, fs.F_OK);
      return true;
    } catch (e) {
      message.error('config file ' + configFile + ' NOT found');
    }
  };

  var checkDefaultConfig = function(loadedConfig, configFile){
    if (!loadedConfig) {
      configFileExists(configFile);
      return yaml.safeLoad(fs.readFileSync(configFile, 'utf-8'));
    }
    return loadedConfig;
  };

  var pathClean = function(configPath) {
    return path.normalize(configPath).replace(/\/$/, '') + '/';
  };

  var checkArguments = function(){
    var loadedConfig = false;
    for (var i = 0; i < process.argv.length; i += 1) {
      if (process.argv[i] === '--silent') {
        message.warning('You\'ve set --silent or --S flag to che gulp process, this could hide some errors not handled by Dustman');
      }
      if (process.argv[i] === '--config' && process.argv[i + 1] !== undefined) {
        configFile = process.argv[i + 1];
        configFileExists(configFile);
        loadedConfig = yaml.safeLoad(fs.readFileSync(configFile, 'utf-8'));
      }
    }
    loadedConfig = checkDefaultConfig(loadedConfig, configFile);
    data = merge.recursive(true, data, loadedConfig);

    data.paths.css = pathClean(data.paths.css);
    data.paths.fonts = pathClean(data.paths.fonts);
    data.paths.images = pathClean(data.paths.images);
    data.paths.js = pathClean(data.paths.js);
    data.paths.server = pathClean(data.paths.server);

    message.setVerbosity(data.config.verbose);
  };


  var warn = function(systemVersion, requiredVersion) {
    message.verbose('Node system version', systemVersion);
    message.verbose('Node required version', requiredVersion);
    message.warning('The system node version is older then the required minimum version', 2);
    message.warning('Please update node version to to avoid malfunctions', 3);
  };

  var checkVersion = function(version) {
    if (typeof version === 'undefined') {
      message.error('Minimum node version not specified');
    }
    var nodeSystemVersion = process.version.match(/(\d+\.\d+)/)[0].split('.');
    nodeMinVersion = version.match(/(\d+\.\d+)/)[0].split('.');

    if (parseInt(nodeSystemVersion[0]) < parseInt(nodeMinVersion[0])) {
      warn(process.version.toString(), version.toString());
    } else if (parseInt(nodeSystemVersion[0]) === parseInt(nodeMinVersion[0]) && parseInt(nodeSystemVersion[1]) < parseInt(nodeMinVersion[1])) {
      warn(process.version.toString(), version.toString());
    }
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
        message.error('Required property ' + colour.yellow(propName) + ' NOT found in ' + colour.yellow(configFile));
      }
      return data[propName];
    },
    hasTask: function(taskName) {
      if (!ifProp('tasks')) {
        message.error('Required property ' + colour.yellow('tasks') + ' NOT found in ' + colour.yellow(configFile));
      }
      for (var i = 0; i < data.tasks.length; i += 1) {
        if (data.tasks[i] === taskName) {
          return true;
        }
      }
      return false;
    },
    if: function(propName){
      return ifProp(propName);
    },
    load: function(version){
      checkVersion(version);
      checkArguments();
    },
    pathClean : function(configPath) {
      return path.normalize(configPath).replace(/\/$/, '') + '/';
    }
  };
})();
