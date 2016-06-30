var task = task || {};

task.html = (function(){

  var faker = require('faker');
  var prettify = require('gulp-html-prettify');
  var twig = require('gulp-twig');

  var name = 'html';
  var paths = {};
  var twigConfig = {};
  var twigPages;

  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var init = function() {
    paths = config.get('paths');
    twigPages = config.if('twig') ? config.get('twig') : {};
    twigConfig = config.if('config') ? config.get('config') : {};
    faker.locale = 'en';
  };

  var build = function() {
    if (config.if('twig') && task.core.has(twigPages, 'files')) {
      gulp.task(name, function () {
        message.task('Twig to HTML');
        if (!task.core.has(twigConfig, 'twig')) {
          twigConfig.twig = {};
        }
        twigConfig.twig.data = {
          faker: faker
        };
        for (var i = 0; i < twigPages.files.length; i += 1) {
          message.verbose('Twig view', twigPages.files[i]);
          task.core.fileCheck(twigPages.files[i]);
        }
        message.verbose('All Twig files converted in', paths.server);
        return gulp.src(twigPages.files)
          .pipe(twig(twigConfig.twig))
          .pipe(prettify(twigConfig.prettify || {}))
          .pipe(gulp.dest(paths.server));
      });
      return [name];
    } else {
      message.warning('Twig files not set, skipping task');
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
