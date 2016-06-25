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
    js = config.if('js') ? config.get('js') : [];
    paths = config.get('paths');
    vendorsConfig = config.if('vendors') ? config.get('vendors') : {};
  };

  var build = function(taskName){
    if (config.if('js')) {
      gulp.task(taskName, function (done) {
        message.task('Merging JavaScript files');
        var notFoundLength = 0;
        for (var i = 0; i < js.files.length; i += 1) {
          if (task.core.fileExists(js.files[i])) {
            message.verbose('JavaScript file', js.files[i]);
          } else {
            notFoundLength += 1;
            message.warning('JavaScript file ' + js.files[i] + ' NOT found');
          }
        }
        if (notFoundLength === js.files.length) {
          message.error('None of the JavaScript files where found, check your "js.files" propery in your configuration file');
          done();
          return;
        }
        message.verbose('JavaScript files merged to', paths.js + js.file);
        return gulp.src(js.files)
          .pipe(sourcemaps.init())
          .pipe(uglify())
          .pipe(concat(js.file))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(paths.js));
      });
      return [taskName];
    }
    return [];
  };

  return {
    get: function(){
      if (!config.hasTask('js:build')) {
        return pipeline;
      }
      init();
      pipeline.middle = pipeline.middle.concat(build(task.core.action(name, 'build')));
      return pipeline;
    }
  };
})();
