var wrapper = wrapper || {};

wrapper.watch = (function(){

  var taskName = 'watch';
  var watchFolders = [];
  var tasksConfig = {};

  var getWatchFolder = function(property) {
    if (task.core.has(tasksConfig, property)) {
      if (task.core.has(tasksConfig[property], 'watch')) {
        return [tasksConfig[property].watch];
      }
    }
    return [];
  };

  var init = function() {
    tasksConfig = config.if('config') ? config.get('config') : false;
    watchFolders = watchFolders.concat(getWatchFolder('css'));
    watchFolders = watchFolders.concat(getWatchFolder('js'));
    watchFolders = watchFolders.concat(getWatchFolder('twig'));
  };

  var build = function(pipeline) {
    gulp.task(taskName, gulp.series(pipeline, function(done){
      done();
    }));
  };

  return {
    set: function(pipeline){
      init();
      build(pipeline);
    }
  };
})();
