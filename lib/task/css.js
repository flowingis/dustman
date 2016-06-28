var task = task || {};

task.css = (function(){
  var autoprefixer = require('gulp-autoprefixer');
  var concat = require('gulp-concat');
  var less = require('gulp-less');
  var merge = require('merge');
  var rename = require('gulp-rename');
  var sass = require('gulp-sass');
  var stylestats = require('gulp-stylestats');
  var sourcemaps = require('gulp-sourcemaps');
  var uglifyCss = require('gulp-uglifycss');

  var name = 'css';
  var paths = {};
  var tasksConfig = {};
  var themeTasks = [];
  var themeBuilds = [];
  var vendorsBuilt = false;
  var vendorsConfig = {};
  var pipeline = {
    before: [],
    middle: [],
    after: []
  };

  var init = function() {
    pipeline.middle.push(name);
    paths = config.get('paths');
    themeTasks = config.if('css') ? config.get('css') : [];
    tasksConfig = config.if('config') ? config.get('config') : {};
    vendorsConfig = config.if('vendors') ? config.get('vendors') : {};
  };

  var fonts = function(theme) {
    if (theme.fonts) {
      if (!task.core.fileExists(theme.fonts)) {
        message.verbose('Checking ' + theme.name + ' fonts', theme.fonts);
        task.core.fileCheck(theme.fonts);
      }
      var taskName = task.core.action(name, theme.name + '-fonts');
      var target = paths.fonts + theme.name;
      gulp.task(taskName, function () {
        message.verbose('Copy theme fonts to', target);
        return gulp.src(theme.fonts)
          .pipe(gulp.dest(target));
      });
      return [taskName];
    }
    return [];
  };

  var images = function(theme) {
    if (theme.images) {
      if (!task.core.fileExists(theme.images)) {
        message.verbose('Checking ' + theme.name + ' images', theme.images);
        task.core.fileCheck(theme.images);
      }
      var taskName = task.core.action(name, theme.name + '-images');
      var target = paths.images + theme.name;
      gulp.task(taskName, function () {
        message.verbose('Copy theme images to', target);
        return gulp.src(theme.images)
          .pipe(gulp.dest(target));
      });
      return [taskName];
    }
    return [];
  };

  var css = function(theme, index, totalThemes) {
    var taskName = task.core.action(name, theme.name + '-css');
    gulp.task(taskName, function () {
      if (totalThemes >= 1) {
        message.task('Build CSS theme ' + (index + 1) + ' of ' + totalThemes);
      } else {
        message.task('Build CSS theme');
      }
      message.verbose('Theme', theme.name);
      message.verbose('File', theme.path + theme.file);
      return gulp.src(theme.compile)
        .pipe(sourcemaps.init())
        .pipe(
          theme.compile.indexOf('.scss') !== -1 ?
            sass({ outputStyle: 'expanded' }).on('error', sass.logError)
          :
            less()
          )
        .pipe(concat(theme.file))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(theme.path));
    });
    return [taskName];
  };

  var autoprefixerRename = function(file) {
    return file.replace('.css', '.autoprefixer.css');
  };

  var getAutoprefixer = function(theme) {
    if (theme.autoprefixer) {
      var taskName = task.core.action(name, theme.name + '-autoprefixer');
      gulp.task(taskName, function () {
        var fileName = autoprefixerRename(theme.file);
        message.task('Browser compatibility');
        message.verbose('Theme', theme.name);
        if (task.core.has(tasksConfig.autoprefixer, 'browsers')) {
          message.verbose('Autoprefixer browsers', tasksConfig.autoprefixer.browsers.toString().replace(new RegExp(',', 'g'), ', '));
        } else {
          message.verbose('Autoprefixer', 'Enabled');
        }
        message.verbose('Adding prefixes to file', theme.path + theme.file);
        message.verbose('Browser prefixes saved to', theme.path + fileName);
        return gulp.src(theme.path + theme.file)
          .pipe(
            autoprefixer(theme.autoprefixer instanceof Object ?
              theme.autoprefixer
              :
              tasksConfig.autoprefixer
            )
          )
          .pipe(rename(fileName))
          .pipe(gulp.dest(theme.path));
      });
      return [taskName];
    }
    return [];
  };

  var getStylestats = function(theme) {
    if (theme.stylestats) {
      var taskName = task.core.action(name, theme.name + '-stylestats');
      var fileName = autoprefixerRename(theme.file);

      gulp.task(taskName, function () {
        return gulp.src(theme.autoprefixer !== false ?
            theme.path + fileName
            :
            theme.path + theme.file
          )
          .pipe(stylestats({
            type: 'md',
            config: theme.stylestats instanceof Object ? theme.stylestats : tasksConfig.stylestats
          }));
      });
      return [taskName];
    }
    return [];
  };

  var themeBuild = function(theme, themePipeline) {
    var taskName = task.core.action(name, theme.name + '-build');
    gulp.task(taskName, gulp.series(themePipeline, function(done){
      done();
    }));
    return [taskName];
  };

  var add = function(theme, index, totalThemes) {
    var themePipeline = [];
    var defaults = {
      autoprefixer: false,
      compile: null,
      csslint: false,
      file: 'theme-' + index.toString() + '.css',
      fonts: false,
      images: false,
      merge: true,
      name: 'theme-' + index.toString(),
      path: paths.css,
      stylestats: false
    };

    themeTasks.themes[index] = merge.recursive(true, defaults, theme);

    if (!themeTasks.themes[index].path) {
      themeTasks.themes[index].path = paths.css;
    }

    themeTasks.themes[index].path = config.pathClean(themeTasks.themes[index].path);

    if (themeTasks.themes[index].compile === null) {
      message.error(themeTasks.themes[index].name + ' "compile" attribute must be specified');
    }

    theme = themeTasks.themes[index];

    themePipeline = themePipeline.concat(fonts(theme));
    themePipeline = themePipeline.concat(images(theme));
    themePipeline = themePipeline.concat(css(theme, index, totalThemes));
    themePipeline = themePipeline.concat(getAutoprefixer(theme));
    themePipeline = themePipeline.concat(getStylestats(theme));
    themeBuilds = themeBuilds.concat(themeBuild(theme, themePipeline));
  };

  var themes = function() {
    for (var i = 0; i < themeTasks.themes.length; i += 1) {
      add(themeTasks.themes[i], i, themeTasks.themes.length);
    }
    return themeBuilds;
  };

  var vendors = function() {
    if (task.core.has(vendorsConfig, 'css') && task.core.has(vendorsConfig.css, 'files')) {
      var taskName = task.core.action(name, 'vendors');
      gulp.task(taskName, function (done) {
        if (vendorsBuilt) {
          message.annoy('Vendors CSS already built, if you need to update them, re-run the task');
          done();
        } else {
          vendorsBuilt = true;
          message.task('Merging CSS vendors');
          for (var i = 0; i < vendorsConfig.css.files.length; i += 1) {
            message.verbose('CSS vendor', vendorsConfig.css.files[i]);
            task.core.fileCheck(vendorsConfig.css.files[i]);
          }
          message.verbose('Vendor CSS files merged to', paths.css + vendorsConfig.css.file);
          return gulp.src(vendorsConfig.css.files)
          .pipe(uglifyCss())
          .pipe(concat(vendorsConfig.css.file))
          .pipe(gulp.dest(paths.css));
        }
      });
      return [taskName];
    }
    return [];
  };

  var needsMerge = function() {
    var theme;
    for (var i = 0; i < themeTasks.themes.length; i += 1) {
      theme = merge.recursive(true, themeTasks.themes[i], { merge: true });
      if (theme.merge === true) {
        return true;
      }
    }
    return false;
  };

  var getVendorsToMerge = function() {
    if (vendorsConfig.css.merge) {
      message.verbose('CSS vendors to merge', paths.css + vendorsConfig.css.file);
      return [paths.css + vendorsConfig.css.file];
    }
    message.verbose('CSS vendors skipped from merge', paths.css + vendorsConfig.css.file);
    return [];
  };

  var getThemesToMerge = function() {
    var fileName, theme, themes = [];
    for (var i = 0; i < themeTasks.themes.length; i += 1) {
      theme = themeTasks.themes[i];
      fileName = theme.autoprefixer ? autoprefixerRename(theme.file) : theme.file;
      if (theme.merge) {
        message.verbose('CSS theme to merge', theme.path + fileName);
        themes.push(theme.path + fileName);
      } else {
        message.verbose('CSS theme skipped from merge', theme.path + fileName);
      }
    }
    return themes;
  };

  var mergeCss = function() {
    if (needsMerge()) {
      var taskName = task.core.action(name, 'merge');
      gulp.task(taskName, function(done){
        var themes = [];
        message.task('Checking CSS files to merge');

        themes = themes.concat(getVendorsToMerge());
        themes = themes.concat(getThemesToMerge());

        if (themes.length > 0) {
          message.verbose('All CSS files merged to', paths.css + themeTasks.file);
          return gulp.src(themes)
            .pipe(uglifyCss())
            .pipe(concat(themeTasks.file))
            .pipe(gulp.dest(paths.css));
        } else {
          message.warning('No vendors or themes will be merged');
          done();
        }
      });
      return [taskName];
    }
    return [];
  };

  var build = function(subTaskPipeline) {
    gulp.task(name, gulp.series(subTaskPipeline, function(done){
      done();
    }));
    return [name];
  };

  return {
    get: function(){
      if (!config.hasTask(name)) {
        return pipeline;
      }
      init();
      var subTaskPipeline = [];
      subTaskPipeline = subTaskPipeline.concat(themes());
      subTaskPipeline = subTaskPipeline.concat(vendors());
      subTaskPipeline = subTaskPipeline.concat(mergeCss());
      pipeline.middle.concat(build(subTaskPipeline));
      return pipeline;
    }
  };
})();