var task = task || {};

task.html = (function(){

  var faker = require('faker');
  var path = require('path');
  var prettify = require('gulp-html-prettify');
  var twig = require('gulp-twig');

  var name = 'html';
  var paths = {};
  var twigConfig = {};
  var templateConfig;

  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var init = function() {
    paths = config.get('paths');
    templateConfig = config.if('html') ? config.get('html') : {};
    twigConfig = config.if('config') ? config.get('config') : {};
    faker.locale = 'en';
  };

  var build = function() {
    if (config.if('html') && task.core.has(templateConfig, 'files')) {
      gulp.task(name, function () {
        message.task('Build HTML');
        if (!task.core.has(twigConfig, 'twig')) {
          twigConfig.twig = {};
        }
        twigConfig.twig.data = {
          faker: faker
        };
        for (var i = 0; i < templateConfig.files.length; i += 1) {
          message.verbose('Template view', templateConfig.files[i]);
          task.core.fileCheck(templateConfig.files[i]);
        }
        message.verbose('All Template files converted in', paths.server);
        if (templateConfig.engine === 'html') {
          return gulp.src(templateConfig.files)
            .pipe(prettify(twigConfig.prettify || {}))
            .pipe(gulp.dest(paths.server));
        }
        return gulp.src(templateConfig.files)
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

  var getFilesToVerifyHTML = function() {
    var htmlConfig, files;
    files = [];
    if (config.if('html')) {
      htmlConfig = config.get('html');
      for (var i = 0; i < htmlConfig.files.length; i += 1) {
        files.push(paths.server + path.parse(htmlConfig.files[i]).name  + '.html');
      }
    }
    return files;
  };

  return {
    get: function(){
      if (!config.hasTask(name)) {
        return pipeline;
      }
      init();
      pipeline.middle = pipeline.middle.concat(build());
      return pipeline;
    },
    verify: function() {
      return getFilesToVerifyHTML();
    }
  };
})();
