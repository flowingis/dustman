var task = task || {};

task.js = (function(){

  var concat = require('gulp-concat');
  var merge = require('merge');
  var sourcemaps = require('gulp-sourcemaps');
  var uglify = require('gulp-uglify');

  var name = 'js';
  var jsConfig = {};
  var paths = {};
  var vendorsConfig = {};
  var vendorsBuilt = false;

  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var checkConfig = function(config, prop, defaults) {
    return task.core.has(config, prop) ? config[prop] : defaults;
  };

  var init = function() {
    jsConfig = config.if(name) ? config.get(name) : [];
    paths = config.get('paths');
    vendorsConfig = checkConfig(jsConfig, 'vendors', {});
    vendorsConfig = merge.recursive(true, { path: paths.js, merge: true }, vendorsConfig);
    if (!task.core.has(vendorsConfig, 'path')) {
      vendorsConfig.path = paths.js;
    }
    if (!task.core.has(jsConfig, 'path')) {
      jsConfig.path = paths.js;
    }
  };

  var vendors = function() {
    if (vendorsConfig.files !== false) {
      var taskName = task.core.action(name, 'vendors');
      gulp.task(taskName, function (done) {
        if (task.core.fileExists(vendorsConfig.path + vendorsConfig.file) && vendorsBuilt) {
          message.notice('Skipping vendors JavaScript build to improve speed, if you need to update them just re-run the task');
          done();
        } else {
          vendorsBuilt = true;
          message.task('Merging JavaScript vendors');
          for (var i = 0; i < vendorsConfig.files.length; i += 1) {
            message.verbose('JavaScript vendor', vendorsConfig.files[i]);
            task.core.fileCheck(vendorsConfig.files[i]);
          }
          message.verbose('Vendors JavaScript files merged to', vendorsConfig.path + vendorsConfig.file);
          return gulp.src(vendorsConfig.files)
          .pipe(uglify())
          .pipe(concat(vendorsConfig.file))
          .pipe(gulp.dest(vendorsConfig.path));
        }
      });
      return [taskName];
    }
    return [];
  };

  var build = function(){
    if (config.if(name) && jsConfig.files) {
      gulp.task(name, function () {
        message.task('Merging JavaScript files');

        var files = [];
        if (vendorsConfig.files && vendorsConfig.merge) {
          files.push(vendorsConfig.path + vendorsConfig.file);
        }

        files = files.concat(jsConfig.files);

        for (var i = 0; i < files.length; i += 1) {
          message.verbose('JavaScript file', files[i]);
          task.core.fileCheck(files[i]);
        }

        message.verbose('JavaScript files merged to', jsConfig.path + jsConfig.file);

        return gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(jsConfig.file))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsConfig.path));
      });
      return [name];
    }
    return [];
  };

  var getFilesToVerifyJSVendors = function() {
    if (vendorsConfig.files) {
      return [vendorsConfig.path + vendorsConfig.file];
    }
    return [];
  };

  var getFilesToVerifyJS = function() {
    var files = [];
    files = getFilesToVerifyJSVendors();
    if (jsConfig.files) {
      files.push(jsConfig.path + jsConfig.file);
    }

    return files;
  };

  return {
    get: function(){
      if (!config.hasTask(name)) {
        return pipeline;
      }
      init();
      pipeline.middle = pipeline.middle.concat(vendors());
      pipeline.middle = pipeline.middle.concat(build());
      return pipeline;
    },
    verify: function() {
      return getFilesToVerifyJS();
    }
  };
})();
