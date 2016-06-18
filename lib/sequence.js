var sequence = (function(){

  var tasks = config.get('tasks');

  return {
    list: function(){
      //
    }
  };
})();




if (c.tasks !== undefined) {
  configTasks = ['message:start', 'timer:start'].concat('shell:before').concat(c.tasks).concat('shell:after').concat(['message:end']);
} else {
  configTasks = ['message:start', 'timer:start'].concat('shell:before').concat(configTasksDefaults).concat('shell:after').concat(['message:end']);
}
