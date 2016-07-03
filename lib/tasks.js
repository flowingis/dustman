var tasks = (function(){

  var browserSync = require('browser-sync');
  var path = require('path');

  var paths;
  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };
  var cssConfig = {};
  var tasksConfig = {};
  var watchFolders = [];

  var getWatchFolder = function(property) {
    if (config.if(property)) {
      var configProperty = config.get(property);
      if (task.core.has(configProperty, 'watch')) {
        return [configProperty.watch];
      }
    }
    return [];
  };

  var init = function() {
    paths = config.if('paths') ? config.get('paths') : false;
    tasksConfig = config.if('config') ? config.get('config') : false;
    cssConfig = config.if('css') ? config.get('css') : false;

    watchFolders = watchFolders.concat(getWatchFolder('css'));
    watchFolders = watchFolders.concat(getWatchFolder('js'));
    watchFolders = watchFolders.concat(getWatchFolder('twig'));
  };

  var addToPipeline = function(subTaskPipeline) {
    pipeline.before = pipeline.before.concat(subTaskPipeline.before);
    pipeline.middle = pipeline.middle.concat(subTaskPipeline.middle);
    pipeline.after = pipeline.after.concat(subTaskPipeline.after.reverse());
  };

  var http = function(tasks) {

    gulp.task('http', gulp.series(tasks, function() {
      browserSync.stream();
      browserSync.init({
        server: {
            baseDir: paths.server
        },
        logLevel: 'info',
        notify: true
      });

      message.wait();

      return gulp.watch(watchFolders, gulp.series(tasks, function(done){
          browserSync.reload();
          message.wait();
          done();
        }))
        .on('change', function(path) {
          message.event('change', path);
        })
        .on('unlink', function(path) {
          message.event('unlink', path);
        })
        .on('add', function(path) {
          message.event('add', path);
        });
    }));
  };

  var watch = function(tasks) {
    gulp.task('watch', gulp.series(tasks, function() {
      message.wait();
      return gulp.watch(watchFolders, gulp.series(tasks, function(done){
          message.wait();
          done();
        }))
        .on('change', function(path) {
          message.event('change', path);
        })
        .on('unlink', function(path) {
          message.event('unlink', path);
        })
        .on('add', function(path) {
          message.event('add', path);
        });
    }));
  };

  var getFilesToVerifyCSSVendors = function() {
    var files = [];
    if (task.core.has(cssConfig, 'vendors')) {
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
    files.push(paths.css + cssConfig.file);

    return files;
  };

  var getFilesToVerifyJSVendors = function(jsConfig) {
    if (task.core.has(jsConfig, 'vendors')) {
      return [jsConfig.vendors.path + jsConfig.vendors.file];
    }
    return [];
  };

  var getFilesToVerifyJS = function() {
    var jsConfig, files;
    files = [];
    if (config.if('js')) {
      jsConfig = config.get('js');
      files = getFilesToVerifyJSVendors(jsConfig);
      files.push(paths.js + jsConfig.file);
    }
    return files;
  };

  var getFilesToVerifyHTML = function() {
    var htmlConfig, files;
    files = [];
    if (config.if('twig')) {
      htmlConfig = config.get('twig');
      for (var i = 0; i < htmlConfig.files.length; i += 1) {
        files.push(paths.server + path.parse(htmlConfig.files[i]).name  + '.html');
      }
    }
    return files;
  };

  var verify = function() {
    var pipeline = {
      before: [],
      middle: [],
      after: []
    };
    if (tasksConfig.verify) {
      var taskName = 'verify';
      gulp.task(taskName, function(done){
        var files = getFilesToVerifyCSS();
        files = files.concat(getFilesToVerifyJS());
        files = files.concat(getFilesToVerifyHTML());
        message.task('Verifying if all files were successfully created');
        for (var i = 0; i < files.length; i += 1) {
          message.verbose('File to check', files[i]);
          task.core.fileCheck(files[i]);
        }
        done();
      });
      pipeline.middle.push(taskName);
    }
    return pipeline;
  };

  var build = function(tasks){
    gulp.task('default', gulp.series(tasks, function(done){
      done();
    }));
  };

  return {
    init: function(){
      init();
      addToPipeline(task.timer.get());
      addToPipeline(task.shell.get());
      addToPipeline(task.css.get());
      addToPipeline(task.js.get());
      addToPipeline(task.vendors.get());
      addToPipeline(task.html.get());
      addToPipeline(verify());
      pipeline.after.reverse();
      var pipelineList = pipeline.before.concat(pipeline.middle.concat(pipeline.after));
      build(pipelineList);
      watch(pipelineList);
      http(pipelineList);
    }
  };
})();
