var wrapper = wrapper || {};

wrapper.default = (function(){
  var taskName = 'default';
  return {
    set: function(pipeline){
      gulp.task(taskName, gulp.series(pipeline, function(done){
        done();
      }));
    }
  };
})();
