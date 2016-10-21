var task = task || {};

task.cache = (function(){

  var fs = require('fs');
  var mkdirp = require('mkdirp');
  var folder = {
    temp: __dirname + '/node_modules/dustman/temp/'
  };

  return {
    init: function() {
      if (!fs.existsSync(folder.temp)){
        mkdirp.sync(folder.temp);
      }
    },
    folder: function(name) {
      return folder[name];
    }
  };
})();
