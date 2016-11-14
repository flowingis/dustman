var notify = (function(){
  var notifier = require('node-notifier');
  var path = require('path');

  var tasksConfig;

  var init = function() {
    tasksConfig = config.get('config');
  };

  return {
    broken: function(message) {
      if (tasksConfig.osNotifications) {
        notifier.notify({
          title: 'Dustman',
          icon: path.join(__dirname, 'images/error.png'),
          message: 'Build broken!\n' + message.toString().trim(),
          sound: true
        });
      }
    },
    error: function(message) {
      if (tasksConfig.osNotifications) {
        notifier.notify({
          title: 'Dustman',
          icon: path.join(__dirname, 'images/warning.png'),
          message: 'Build error!\n' + message.toString().trim()
        });
      }
      tasks.buildStatus(false);
    },
    recovered: function() {
      if (tasksConfig.osNotifications) {
        notifier.notify({
          title: 'Dustman',
          icon: path.join(__dirname, 'images/success.png'),
          message: 'Build recovered!\nNow you can continue working'
        });
      }
    },
    init: function() {
      init();
    }
  };
})();
