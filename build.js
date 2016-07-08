var buildify = require('buildify'),
    fs = require('fs');

var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

buildify()
  .concat([
    'lib/message.js',
    'lib/config.js',
    'lib/task-core.js',
    'lib/tasks.js',
    'lib/task/timer.js',
    'lib/task/vendors.js',
    'lib/task/shell.js',
    'lib/task/html.js',
    'lib/task/css.js',
    'lib/task/js.js'
  ])
  .wrap('lib/template.js', {
    version: pkg.version,
    nodeVersion: pkg.engines.node
  })
  .save('gulpfile.js');
