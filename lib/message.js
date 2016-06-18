
var message = (function(){
  var colors = require('colors');

  var phrases = {
    add: [
      'What the hell is %file%?? I, DUSTMAN will do something to solve this situation...',
      'I\'ve found a sensational discovery, %file% is alive!',
      'Hey %file%, welcome to da build',
      'File %file% detected. Updating the build.'
    ],
    change: [
      'Hey, something\'s happened to %file%, this is a work for DUSTMAN...',
      'Dear %file%, do you really though I wouldn\'t noticed you? Hahaha!',
      'Aha! %file%! You are under build!',
    ],
    unlink: [
      'We have lost %file%, this is a work for DUSTMAN...',
      'Oh my god... %file%... Nooooo!',
      'Another good %file% gone... I will avange you...',
    ]
  };

  var isVerboseEnough = function(verbosity) {
    return config.get('config').verbose >= verbosity;
  };

  var log = function(level, message) {
    if (isVerboseEnough(level)) {
      console.log(message);
    }
  };

  var logReturn = function() {
    log(3, '');
  };

  return {
    intro: function() {
      console.log('');
      console.log(colors.magenta('   D U S T M A N   '));
      console.log('');
    },
    error: function(message) {
      log(0, colors.red('Error: ') + message.trim());
    },
    event: function(eventType, file) {
      var min, max, phrase, splitPhrase, index;
      min = 1;
      max = phrases[eventType].length;
      index = (Math.floor(Math.random() * (max - min + 1)) + min) - 1;
      phrase = phrases[eventType][index];
      splitPhrase = phrase.split('%file%');
      log(1, colors.magenta(splitPhrase[0]) + file + colors.magenta(splitPhrase[1]));
      logReturn();
    },
    speak: function(message) {
      log(2, message);
    },
    verbose: function(title, message) {
      if (typeof message !== 'undefined') {
        log(3, colors.blue(title.trim() + ': ') + message.trim());
      } else {
        log(3, colors.blue(title.trim()));
      }
    },
    warning: function(message){
      log(2, colors.yellow('Warning: ') + message.trim());
    },
  };
})();
