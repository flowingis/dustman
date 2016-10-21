var tasks = (function(){

  var browserSync = require('browser-sync');

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

    task.cache.init();

    watchFolders = watchFolders.concat(getWatchFolder('css'));
    watchFolders = watchFolders.concat(getWatchFolder('js'));
    watchFolders = watchFolders.concat(getWatchFolder('html'));
  };

  var addToPipeline = function(subTaskPipeline) {
    pipeline.before = pipeline.before.concat(subTaskPipeline.before);
    pipeline.middle = pipeline.middle.concat(subTaskPipeline.middle);
    pipeline.after = pipeline.after.concat(subTaskPipeline.after.reverse());
  };

  var pollingOptions = function() {
    if (tasksConfig.polling !== false) {
      return {
        usePolling: true,
        interval: parseInt(tasksConfig.polling)
      };
    }
    return {};
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

      return gulp.watch(watchFolders, pollingOptions(), gulp.series(tasks, function(done){
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
    gulp.task('h', gulp.parallel('http'));
  };

  var watch = function(tasks) {
    gulp.task('watch', gulp.series(tasks, function() {
      message.wait();
      return gulp.watch(watchFolders, pollingOptions(), gulp.series(tasks, function(done){
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
    gulp.task('w', gulp.parallel('watch'));
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
        var files = [];
        files = files.concat(task.css.verify());
        files = files.concat(task.js.verify());
        files = files.concat(task.html.verify());
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
