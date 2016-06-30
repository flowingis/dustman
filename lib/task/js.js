var task = task || {};

task.js = (function(){

  var concat = require('gulp-concat');
  var sourcemaps = require('gulp-sourcemaps');
  var uglify = require('gulp-uglify');

  var name = 'js';
  var js = {};
  var paths = {};
  var vendorsConfig = {};

  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var init = function() {
    js = config.if(name) ? config.get(name) : [];
    paths = config.get('paths');
    vendorsConfig = config.if('vendors') ? config.get('vendors') : {};
  };

  var build = function(){
    if (config.if(name)) {
      gulp.task(name, function () {
        message.task('Merging JavaScript files');
        for (var i = 0; i < js.files.length; i += 1) {
          message.verbose('JavaScript file', js.files[i]);
          task.core.fileCheck(js.files[i]);
        }
        message.verbose('JavaScript files merged to', paths.js + js.file);
        return gulp.src(js.files)
          .pipe(sourcemaps.init())
          .pipe(uglify())
          .pipe(concat(js.file))
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
      pipeline.middle = pipeline.middle.concat(build());
      return pipeline;
    }
  };
})();
