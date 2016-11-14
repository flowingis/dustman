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
        notify.broken('File not found, have you installed vendors after npm install?');
        message.error(path.toString() + ' NOT found');
        if (path.toString().toLowerCase().indexOf('vendor') > -1) {
          message.warning('Have you installed vendors after npm install?');
        }
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
