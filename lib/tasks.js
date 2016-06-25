var tasks = (function(){
  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var addToPipeline = function(subTaskPipeline) {
    pipeline.before = pipeline.before.concat(subTaskPipeline.before);
    pipeline.middle = pipeline.middle.concat(subTaskPipeline.middle);
    pipeline.after = pipeline.after.concat(subTaskPipeline.after.reverse());
  };

  return {
    init: function(){
      var buildPipeline = [];
      addToPipeline(task.timer.get());
      addToPipeline(task.shell.get());
      addToPipeline(task.css.get());
      addToPipeline(task.js.get());
      addToPipeline(task.vendors.get());
      addToPipeline(task.html.get());
      pipeline.after.reverse();
      buildPipeline = pipeline.before.concat(pipeline.middle.concat(pipeline.after));
      // console.log(buildPipeline);
      wrapper.default.set(buildPipeline);  // build
      // wrapper.watch.set(buildPipeline); // watch build
      // wrapper.http.set(buildPipeline);  // watch build http
    }
  };
})();
