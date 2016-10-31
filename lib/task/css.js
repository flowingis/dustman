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
  var cssConfig = {};
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

  var checkConfig = function(config, prop, defaults) {
    return task.core.has(config, prop) ? config[prop] : defaults;
  };

  var init = function() {
    pipeline.middle.push(name);
    paths = config.get('paths');
    cssConfig = config.if('css') ? config.get('css') : {};
    themeTasks = checkConfig(cssConfig, 'themes', []);
    tasksConfig = config.if('config') ? config.get('config') : {};
    vendorsConfig = checkConfig(cssConfig, 'vendors', {});
    vendorsConfig = merge.recursive(true, { path: paths.css, merge: true }, vendorsConfig);
    if (!task.core.has(vendorsConfig, 'path')) {
      vendorsConfig.path = paths.css;
    }
    if (!task.core.has(cssConfig, 'path')) {
      cssConfig.path = paths.css;
    }
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
            sass({ outputStyle: 'expanded' }).on('error', function(err){
              console.log(err.formatted);
              message.error('Checkout SASS error before this message');
            })
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

    themeTasks[index] = merge.recursive(true, defaults, theme);

    if (!themeTasks[index].path) {
      themeTasks[index].path = paths.css;
    }

    themeTasks[index].path = config.pathClean(themeTasks[index].path);

    if (themeTasks[index].compile === null) {
      message.error(themeTasks[index].name + ' "compile" attribute must be specified');
    }

    theme = themeTasks[index];

    themePipeline = themePipeline.concat(css(theme, index, totalThemes));
    themePipeline = themePipeline.concat(getAutoprefixer(theme));
    themePipeline = themePipeline.concat(fonts(theme));
    themePipeline = themePipeline.concat(images(theme));
    themePipeline = themePipeline.concat(getStylestats(theme));
    themeBuilds = themeBuilds.concat(themeBuild(theme, themePipeline));
  };

  var themes = function() {
    for (var i = 0; i < themeTasks.length; i += 1) {
      add(themeTasks[i], i, themeTasks.length);
    }
    return themeBuilds;
  };

  var vendors = function() {
    if (vendorsConfig.files !== false) {
      var taskName = task.core.action(name, 'vendors');
      gulp.task(taskName, function (done) {
        if (task.core.fileExists(vendorsConfig.path + vendorsConfig.file) && vendorsBuilt) {
          message.notice('Skipping vendors CSS build to improve speed, if you need to update them just re-run the task');
          done();
        } else {
          vendorsBuilt = true;
          message.task('Merging CSS vendors');
          for (var i = 0; i < vendorsConfig.files.length; i += 1) {
            message.verbose('CSS vendor', vendorsConfig.files[i]);
            task.core.fileCheck(vendorsConfig.files[i]);
          }
          message.verbose('CSS vendor files merged to', vendorsConfig.path + vendorsConfig.file);
          return gulp.src(vendorsConfig.files)
          .pipe(uglifyCss())
          .pipe(concat(vendorsConfig.file))
          .pipe(gulp.dest(vendorsConfig.path));
        }
      });
      return [taskName];
    }
    return [];
  };

  var needsMerge = function() {
    var theme;
    for (var i = 0; i < themeTasks.length; i += 1) {
      theme = merge.recursive(true, themeTasks[i], { merge: true });
      if (theme.merge === true) {
        return true;
      }
    }
    return false;
  };

  var getVendorsToMerge = function() {
    if (vendorsConfig.merge) {
      message.verbose('CSS vendors to merge', vendorsConfig.path + vendorsConfig.file);
      return [vendorsConfig.path + vendorsConfig.file];
    }
    message.verbose('CSS vendors skipped from merge', vendorsConfig.path + vendorsConfig.file);
    return [];
  };

  var getThemesToMerge = function() {
    var fileName, theme, themes = [];
    for (var i = 0; i < themeTasks.length; i += 1) {
      theme = themeTasks[i];
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

        if (vendorsConfig.files) {
          message.task('Merging CSS vendors with your CSS themes');
          themes = themes.concat(getVendorsToMerge());
        } else {
          message.task('Merging CSS themes');
        }
        themes = themes.concat(getThemesToMerge());

        if (themes.length > 0) {
          message.verbose('All CSS files merged to', cssConfig.path + cssConfig.file);
          return gulp.src(themes)
            .pipe(uglifyCss())
            .pipe(concat(cssConfig.file))
            .pipe(gulp.dest(cssConfig.path));
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

  var getFilesToVerifyCSSVendors = function() {
    var files = [];
    if (cssConfig.vendors && cssConfig.vendors.files) {
      files.push(cssConfig.vendors.path + cssConfig.vendors.file);
    }
    return files;
  };

  var getFilesToVerifyCSS = function() {
    var files, theme;
    files = [];
    if (task.core.has(cssConfig, 'themes')) {
      for (var i = 0; i < cssConfig.themes.length; i += 1) {
        theme = cssConfig.themes[i];
        files.push(theme.path + theme.file);
        if (theme.autoprefixer) {
          files.push(theme.path + theme.file.replace('.css', '.autoprefixer.css'));
        }
      }
    }
    files.concat(getFilesToVerifyCSSVendors());
    if (cssConfig.themes) {
      files.push(cssConfig.path + cssConfig.file);
    }
    return files;
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
    },
    verify: function() {
      return getFilesToVerifyCSS();
    }
  };
})();
