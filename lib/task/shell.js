var task = task || {};

task.shell = (function(){
  var exec = require('child_process').exec;
  var name = 'shell';
  var taskConfig = [];
  var pipeline = {
    before: [],
    middle:[],
    after: []
  };

  var init = function() {
    taskConfig = config.if('shell') ? config.get('shell') : [];
  };

  var afterMessage = function(){
    if (task.core.has(taskConfig, 'after')) {
      var taskName = task.core.action(name, 'after-message');
      gulp.task(taskName, function(done){
        message.task('Executing shell tasks after build');
        done();
      });
      pipeline.after.push(taskName);
    }
  };

  var afterTask = function(index) {
    var taskName = task.core.action(name, 'after-' + index);
    pipeline.after.push(taskName);
    gulp.task(taskName, function(done){
      exec(taskConfig.after[index], function (err) {
        done(err);
      });
    });
  };

  var after = function(){
    if (task.core.has(taskConfig, 'after')) {
      afterMessage();
      for (var i = 0; i < taskConfig.after.length; i += 1) {
        afterTask(i);
      }
    }
  };

  var beforeMessage = function(){
    if (task.core.has(taskConfig, 'before')) {
      var taskName = task.core.action(name, 'before-message');
      gulp.task(taskName, function(done){
        message.task('Executing shell tasks before build');
        done();
      });
      pipeline.before.push(taskName);
    }
  };

  var beforeTask = function(index) {
    var taskName = task.core.action(name, 'before-' + index);
    pipeline.before.push(taskName);
    gulp.task(taskName, function(done){
      console.log('before shell task', taskConfig.before[index]);
      exec(taskConfig.before[index], function (err) {
        console.log('before shell task DONE');
        done(err);
      });
    });
  };

  var before = function(){
    if (task.core.has(taskConfig, 'before')) {
      beforeMessage();
      for (var i = 0; i < taskConfig.before.length; i += 1) {
        beforeTask(i);
      }
    }
  };

  return {
    get: function(){
      init();
      before();
      after();
      return pipeline.before.length > 1 || pipeline.after.length > 1 ? pipeline : false;
    }
  };
})();
