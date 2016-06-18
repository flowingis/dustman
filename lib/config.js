
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
