
var config = (function(){
  var colour = require('colour');
  var fs = require('fs');
  var yaml = require('js-yaml');
  var merge = require('merge');
  var path = require('path');

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
    css: {
      file: 'dustman.min.css',
      watch: './**/*.css'
    },
    js: {
      file: 'dustman.min.js',
      watch: './**/*.js'
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
    ],
    vendors: {
      css: {
        merge: true
      }
    }
  };

  var configFileExists = function(configFile) {
    try {
      fs.accessSync(configFile, fs.F_OK);
      return true;
    } catch (e) {
      console.log(colour.red('Error: config file ') + colour.yellow(configFile) + colour.red(' NOT found'));
      process.exit();
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
  };

  var ifProp = function(propName) {
    return typeof data[propName] !== 'undefined' ? true : false;
  };

  var error = function(message) {
    console.log(colour.red('Error:') + message);
    process.exit();
  };

  return {
    file: function() {
      return configFile;
    },
    get: function(propName){
      if (!ifProp(propName)) {
        error('Required property ' + colour.yellow(propName) + ' NOT found in ' + colour.yellow(configFile));
      }
      return data[propName];
    },
    hasTask: function(taskName) {
      if (!ifProp('tasks')) {
        error('Required property ' + colour.yellow('tasks') + ' NOT found in ' + colour.yellow(configFile));
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
    load: function(){
      checkArguments();
    },
    pathClean : function(configPath) {
      return path.normalize(configPath).replace(/\/$/, '') + '/';
    }
  };
})();
