var buildify = require('buildify'),
  fs = require('fs');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

buildify()
  .concat([
    'lib/config.js',
    'lib/message.js'
  ])
  .wrap('lib/release.js', { version: pkg.version })
  .save('gulpfile.dustman.js');
