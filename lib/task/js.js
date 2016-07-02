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
  };

  var vendors = function() {
    if (task.core.has(vendorsConfig, 'files')) {
      var taskName = task.core.action(name, 'vendors');
      gulp.task(taskName, function (done) {
        if (vendorsBuilt) {
          message.tip('Skipping vendors JavaScript build to improve speed, if you need to update them just re-run the task');
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

  var mergeJs = function() {
    if (vendorsConfig.merge) {
      var taskName = task.core.action(name, 'merge');
      gulp.task(taskName, function(done){
        var files = [];
        message.task('Merging JavaScript vendors with your JavaScript files');

        files.push(vendorsConfig.path + vendorsConfig.file);
        files.push(paths.js + jsConfig.file.replace('.min.js', '.no-vendors.min.js'));

        for (var i = 0; i < files.length; i += 1) {
          message.verbose('JavaScript file', files[i]);
          task.core.fileCheck(files[i]);
        }

        if (files.length > 0) {
          message.verbose('All JavaScript files merged to', paths.js + jsConfig.file);
          return gulp.src(files)
            .pipe(uglify())
            .pipe(concat(jsConfig.file))
            .pipe(gulp.dest(paths.js));
        } else {
          message.warning('No vendors or files will be merged');
          done();
        }
      });
      return [taskName];
    }
    return [];
  };

  var build = function(){
    if (config.if(name)) {
      gulp.task(name, function () {
        message.task('Merging JavaScript files');
        for (var i = 0; i < jsConfig.files.length; i += 1) {
          message.verbose('JavaScript file', jsConfig.files[i]);
          task.core.fileCheck(jsConfig.files[i]);
        }
        var file = jsConfig.file;
        if (vendorsConfig.merge) {
          file = file.replace('.min.js', '.no-vendors.min.js');
        }
        message.verbose('JavaScript files merged to', paths.js + file);

        return gulp.src(jsConfig.files)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(file))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.js));
      });
      return [name];
    }
    return [];
  };

  return {
    get: function(){
      if (!config.hasTask(name)) {
        return pipeline;
      }
      init();
      pipeline.middle = pipeline.middle.concat(vendors());
      pipeline.middle = pipeline.middle.concat(build());
      pipeline.middle = pipeline.middle.concat(mergeJs());
      return pipeline;
    }
  };
})();
