var task = task || {};

task.core = (function(){

  var fs = require('fs');

  return {
    action: function(name, actionName) {
      return name + ':' + actionName;
    },
    fileCheck: function(path){
      try {
        path = path.replace(new RegExp(/\*.*$/), '');
        fs.accessSync(path, fs.F_OK);
        return true;
      } catch (e) {
        message.error(path + ' NOT found');
        console.log(e);
        process.exit();
      }
    },
    fileExists: function(path) {
      try {
        path = path.replace(new RegExp(/\*.*$/), '');
        fs.accessSync(path, fs.F_OK);
        return true;
      } catch (e) {
        return false;
      }
    },
    has: function(task, property) {
      return property in task ? true : false;
    }
  };
})();
