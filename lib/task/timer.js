var task = task || {};

task.timer = (function(){
  var moment = require('moment');

  var name = 'timer';
  var startBuildDate;
  var buildIndex = 1;

  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var start = function(){
    var taskName = task.core.action(name, 'start');
    gulp.task(taskName, function(done){
      startBuildDate = Date.now();
      done();
    });
    pipeline.before.push(taskName);
  };

  var stop = function(){
    var taskName = task.core.action(name, 'stop');
    gulp.task(taskName, function(done){
      var stopBuildDate = Date.now();
      var timeSpent = (stopBuildDate - startBuildDate)/1000 + ' secs';
      message.success('The dust was cleaned successfully in ' + timeSpent);
      message.success('Build [ ' + buildIndex + ' ] done at ' + moment().format('HH:mm') + ' and ' + moment().format('ss') + ' seconds.');
      buildIndex += 1;
      done();
    });
    pipeline.after.push(taskName);
  };

  return {
    duration: function(){

    },
    get: function(){
      start();
      stop();
      return pipeline;
    }
  };
})();
