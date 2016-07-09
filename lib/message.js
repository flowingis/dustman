
var message = (function(){
  var colour = require('colour');
  // var sleep = require('sleep').sleep;

  colour.setTheme({
    error: 'red bold',
    event: 'magenta',
    intro: 'rainbow',
    notice: 'yellow',
    speak: 'white',
    success: 'green',
    task: 'white',
    verbose: 'blue',
    warning: 'yellow bold'
  });

  var verbose = 3;

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
      'We change every day, just as you, %file%'
    ],
    unlink: [
      'We have lost %file%, this is a work for DUSTMAN...',
      'Oh my god... %file%... Nooooo!',
      'Another good %file% gone... I will avange you...',
      'Good bye %file%. I will clean your past without pain.'
    ],
    wait: [
      'Waiting silently if something changes, is unlinked or added',
      'Dustman is watching them',
      'The dust is never clear totally, waiting for changes',
      'I will seek and clean. Again, and again'
    ]
  };

  var isVerboseEnough = function(verbosity) {
    return verbose >= verbosity;
  };

  var log = function(level, message, delay) {
    if (isVerboseEnough(level)) {
      console.log(message);
      if (typeof delay !== 'undefined') {
        var waitTill = new Date(new Date().getTime() + delay * 1000);
        while(waitTill > new Date()) { }
        // sleep(delay);
      }
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
    intro: function() {
      console.log('');
      console.log(colour.intro('   D U S T M A N   '));
      console.log('');
    },
    error: function(message, doNotExit) {
      var exit = typeof doNotExit !== 'undefined' ? doNotExit : true;
      log(0, colour.error('Error: ') + message.trim());
      if(exit) {
        process.exit();
      }
    },
    event: function(eventType, file) {
      event(eventType, file);
    },
    wait: function() {
      log(3, '');
      event('wait');
    },
    notice: function(message, delay) {
      log(2, colour.notice('Notice: ') + message.trim(), delay);
    },
    setVerbosity: function(verbosity) {
      verbose = verbosity;
    },
    speak: function(message, delay) {
      log(2, colour.speak(message), delay);
    },
    success: function(message, delay) {
      log(1, colour.success(message.trim()), delay);
    },
    task: function(message, delay) {
      log(3, '');
      log(2, colour.task(message), delay);
    },
    verbose: function(title, message, delay) {
      if (typeof message !== 'undefined') {
        log(3, colour.verbose(title.trim() + ': ') + message.trim(), delay);
      } else {
        log(3, colour.verbose(title.trim()), delay);
      }
    },
    warning: function(message, delay){
      log(2, colour.warning('Warning: ') + message.trim(), delay);
    },
  };
})();
