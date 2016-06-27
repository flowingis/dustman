
var message = (function(){
  var colour = require('colour');
  colour.setTheme({
    annoy: 'grey',
    error: 'red bold',
    event: 'magenta',
    intro: 'rainbow',
    speak: 'white',
    success: 'green',
    task: 'white',
    verbose: 'blue',
    warning: 'yellow bold'
  });

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
    ],
    wait: [
      'Waiting silently if something changes, is unlinked or added',
      'Dustman is watching them',
      'The dust is never clear totally, waiting for changes'
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

  var event = function(eventType, file) {
    var min, max, phrase, splitPhrase, finalPhrase, index;
    min = 1;
    max = phrases[eventType].length;
    index = (Math.floor(Math.random() * (max - min + 1)) + min) - 1;
    phrase = phrases[eventType][index];

    if (typeof file !== 'undefined') {
      splitPhrase = phrase.split('%file%');
      finalPhrase = colour.event(splitPhrase[0]) + file + colour.event(splitPhrase[1]);
    } else {
      finalPhrase = colour.event(phrase + '...');
    }

    log(1, finalPhrase);
  };

  return {
    annoy: function(message) {
      log(4, colour.annoy(message.trim()));
    },
    intro: function() {
      console.log('');
      console.log(colour.intro('   D U S T M A N   '));
      console.log('');
    },
    error: function(message) {
      log(0, colour.error('Error: ') + message.trim());
      process.exit();
    },
    event: function(eventType, file) {
      event(eventType, file);
    },
    wait: function() {
      log(3, '');
      event('wait');
    },
    notice: function(message) {
      log(3, colour.verbose('Notice: ') + message.trim());
    },
    speak: function(message) {
      log(2, colour.speak(message));
    },
    success: function(message) {
      log(2, colour.success(message.trim()));
    },
    task: function(message) {
      log(3, '');
      log(2, colour.task(message));
    },
    verbose: function(title, message) {
      if (typeof message !== 'undefined') {
        log(3, colour.verbose(title.trim() + ': ') + message.trim());
      } else {
        log(3, colour.verbose(title.trim()));
      }
    },
    warning: function(message){
      log(2, colour.warning('Warning: ') + message.trim());
    },
  };
})();
