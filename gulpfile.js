'use strict';

var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  analyzer     = require('analyze-css'), // https://github.com/macbre/analyze-css
  colors       = require('colors'),
  concat       = require('gulp-concat'),
  csslint      = require('gulp-csslint'),
  moment       = require('moment'),
  plugins      = require('gulp-load-plugins')(),
  sequence     = require('run-sequence'),
  exec          = require('child_process').exec,
  sass         = require('gulp-sass'),
  less         = require('gulp-less'),
  rename       = require('gulp-rename'),
  jshint       = require('gulp-jshint'), // https://github.com/spalger/gulp-jshint
  sourcemaps   = require('gulp-sourcemaps'),
  stylestats   = require('gulp-stylestats'),
  uglify       = require('gulp-uglify'),
  uglifyCss    = require('gulp-uglifycss'),
  yaml         = require('js-yaml'),
  fs           = require('fs'),
  twig         = require('gulp-twig'),
  prettify     = require('gulp-html-prettify'),
  faker        = require('faker'),
  browserSync  = require('browser-sync');

var buildIndex = 0,
  c = false,
  cssThemes = [],
  startBuildDate,
  themeBuildTasks = [],
  themesTotal = 0,
  phrases = {},
  isWatching = false,
  configTasks = [],
  configTasksDefaults = [],
  shellBeforeCommands = [],
  shellAfterCommands = [];

configTasksDefaults = [
  'css:build',
  'js:build',
  'html:build'
];

phrases.change = [
  'Hey, something\'s happened to %file%, this is a work for DUSTMAN...',
  'Dear %file%, do you really though I wouldn\'t noticed you? Hahaha!',
  'Aha! %file%! You are under build!'
];
phrases.unlink = [
  'We have lost %file%, this is a work for DUSTMAN...',
  'Oh my god... %file%... Nooooo!',
  'Another good %file% gone... I will avange you...'
];
phrases.add = [
  'What the hell is %file%?? I, DUSTMAN will do something to solve this situation...',
  'I made a sensational discovery, %file% was found right there!',
  'Hey %file%, welcome to the build',
];

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

for (var i = 0; i < process.argv.length; i += 1) {
    if (process.argv[i] === '--config') {
        if (process.argv[i+1] !== undefined) {
            var file = process.argv[i + 1];
            c = yaml.safeLoad(fs.readFileSync(file, 'utf-8'));
        }
    }
}

if (!c) {
  c = yaml.safeLoad(fs.readFileSync('./dustman.yml', 'utf-8'));
}

if (c.css === undefined) {
  console.log(colors.red('Error: object dustman is NOT present in YAML configuration.'));
  process.exit();
}

faker.locale = c.config.faker ? c.config.faker.locale ? c.config.faker.locale : 'en' : 'en';
themesTotal = c.css.themes.length;

if (c.tasks !== undefined) {
  configTasks = ['message:start', 'timer:start'].concat('shell:before').concat(c.tasks).concat('shell:after').concat(['message:end']);
} else {
  configTasks = ['message:start', 'timer:start'].concat('shell:before').concat(configTasksDefaults).concat('shell:after').concat(['message:end']);
}

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

var messageVerbose = function(title, message) {
  if (c.config.verbose !== undefined && c.config.verbose >= 3) {
    if (message !== undefined) {
      console.log(colors.yellow(title.trim() + ': ') + message.trim());
    } else {
      console.log(colors.yellow(title.trim()));
    }
  }
};

var message = function(message, force) {
  if (force !== undefined && force || c.config.verbose !== undefined && c.config.verbose >= 2) {
    console.log(message);
  }
};

var messageFile = function(phrases, file) {
  var min, max, phrase, splitPhrase, index;
  min = 1;
  max = phrases.length;
  index = (Math.floor(Math.random() * (max - min + 1)) + min) - 1;
  phrase = phrases[index];
  splitPhrase = phrase.split('%file%');
  message(colors.magenta(splitPhrase[0]) + file + colors.magenta(splitPhrase[1]));
  messageVerbose('');
};

var messageError = function(message) {
  if (c.config.verbose !== undefined && c.config.verbose >= 1) {
    console.log(colors.red('Error: ') + message.trim());
  }
};

var messageWarning = function(message) {
  if (c.config.verbose !== undefined && c.config.verbose >= 2) {
    console.log(colors.magenta('Warning: ') + message.trim());
  }
};

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

var check = function(path, throwErr) {
  var throwError = throwErr || false;
  try {
    path = path.replace(new RegExp(/\*.*$/), '');
    fs.accessSync(path, fs.F_OK);
      return true;
  } catch (e) {
    if (throwError) {
      messageError(path + colors.red(' not found'));
      if (c.config.verbose !== undefined && c.config.verbose >= 3) {
        console.log(e);
      }
      process.exit();
    } else {
      return false;
    }
  }
};

var checkConfig = function(name, value) {
  if (value === undefined) {
    messageError('No "' + name + '" defined in config YAML');
    process.exit();
  } else {
    return true;
  }
};

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

var watchList = function() {
  var list = [];
  if (checkConfig('twig.watch', c.twig.watch)) {
    list.push(c.twig.watch);
  }

  if (checkConfig('css.watch', c.css.watch)) {
    list.push(c.css.watch);
  }

  if (checkConfig('js.watch', c.js.watch)) {
    list.push(c.js.watch);
  }
  return list;
};

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

var taskPrefix = function(themeName, action) {
  return 'css:theme:' + themeName + ':' + action;
};

var tasksList = function(theme, taskNames) {
  var tasks = [];
  for (var i = 0; i < taskNames.length; i += 1) {
    tasks.push(taskPrefix(theme.name, taskNames[i]));
  }
  return tasks;
};

var tasks = function(theme, taskNames) {
  var tasks = {};
  for (var i = 0; i < taskNames.length; i += 1) {
    tasks[taskNames[i]] = taskPrefix(theme.name, taskNames[i]);
  }
  return tasks;
};

/* = = = = = = = = = = = = = = = = = = = = = = = = = */

var addTask = function(theme, index){

  var compile = theme.compile,
    file = theme.file,
    merge = theme.merge !== undefined ? theme.merge : true,
    path = theme.path !== undefined ? theme.path : c.paths.css,
    fonts = theme.fonts !== undefined ? theme.fonts : false,
    images = theme.images !== undefined ? theme.images : false,
    name = theme.name !== undefined ? theme.name : 'theme-' + index,
    prefixAutoprefixer = c.config.autoprefixer ? theme.autoprefixer ? true : false : false,
    reportStylestats = c.config.stylestats ? theme.stylestats ? true : false : false,
    task = {},
    tasksToBuild = [],
    testCsslint = c.config.csslint ? theme.csslint ? true : false : false,
    themeBuildSubTasks = [];

  check(compile, true);

  tasksToBuild = ['build', 'css'];

  if (testCsslint) { tasksToBuild.push('testCsslint'); }
  if (reportStylestats) { tasksToBuild.push('reportStylestats'); }
  if (prefixAutoprefixer) { tasksToBuild.push('prefixAutoprefixer'); }
  if (images) { tasksToBuild.push('images'); }
  if (fonts) { tasksToBuild.push('fonts'); }

  task = tasks(theme, tasksToBuild);
  themeBuildTasks.push(task.build);
  themeBuildSubTasks = tasksList(theme, tasksToBuild.slice(1));

  if (!prefixAutoprefixer) {
    cssThemes.push({
      file: path + file,
      merge: merge
    });
  } else {
    cssThemes.push({
      file: path + file.replace('.css', '.autoprefixer.css'),
      merge: merge
    });
  }

  gulp.task(task.css, function () {
    if (buildIndex === 0 && index > 0 ) {
      messageVerbose('');
    }
    message('Build CSS theme');

    if (themesTotal >= 1) {
      messageVerbose('Theme task', name + ' ' + (index + 1) + ' of ' + themesTotal);
    }
    messageVerbose('File', path + file);

    return gulp.src(compile)
      .pipe(sourcemaps.init())
      .pipe(
        compile.indexOf('.scss') !== -1 ?
          sass({ outputStyle: 'expanded' }).on('error', sass.logError)
        :
          less()
        )
      .pipe(concat(file))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(path));
  });

  if (prefixAutoprefixer) {
    gulp.task(task.prefixAutoprefixer, function () {
      var fileName = file.replace('.css', '.autoprefixer.css');
      messageVerbose('');
      message('Browser compatibility');
      messageVerbose('Theme', name);
      if (c.config.autoprefixer.browsers) {
        messageVerbose('Autoprefixer browsers', c.config.autoprefixer.browsers.toString().replace(new RegExp(',', 'g'), ', '));
      } else {
        messageVerbose('Autoprefixer', 'Enabled');
      }
      messageVerbose('Adding prefixes to file', path + file);
      messageVerbose('Browser prefixes saved to', path + fileName);
      return gulp.src(path + file)
        .pipe(autoprefixer(c.config.autoprefixer))
        .pipe(rename(fileName))
        .pipe(gulp.dest(path));
    });
  }

  if (testCsslint) {
    gulp.task(task.testCsslint, function () {
      messageVerbose('');
      message('CSSlint');
      messageVerbose('Theme', name);
      return gulp.src(path + file)
        .pipe(csslint(c.config.csslint))
        .pipe(csslint.reporter());
    });
  }

  if (reportStylestats) {
    gulp.task(task.reportStylestats, function () {
      return gulp.src(path + file)
        .pipe(stylestats({
          type: 'md',
          config: c.config.stylestats
        }));
    });
  }

  if (images) {
    gulp.task(task.images, function () {
      messageVerbose('Copy theme images', c.paths.images + name);
      return gulp.src(images)
        .pipe(gulp.dest(c.paths.images + name));
    });
  }

  if (fonts) {
    gulp.task(task.fonts, function () {
      messageVerbose('Copy theme fonts', c.paths.fonts + name);
      return gulp.src(fonts)
        .pipe(gulp.dest(c.paths.fonts + name));
    });
  }

  gulp.task(task.build, gulp.series(themeBuildSubTasks, function(done){
    done();
  }));
};

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

gulp.task('message:start', function (done) {
  if (buildIndex === 0) {
    message('', true);
    message(colors.magenta('   D U S T M A N   '), true);
    message('', true);
  }
  done();
});

gulp.task('timer:start', function(done){
  startBuildDate = Date.now();
  done();
});

if (checkConfig('css', c.css)) {
  if (checkConfig('css.themes', c.css.themes)) {
    for (var t = 0; t < c.css.themes.length; t += 1) {
      addTask(c.css.themes[t], t);
    }
  }
}

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

var addTaskShellCommand = function(when, command, index){
  var commandName = 'shell:' + when + ':' + index;
  if (when === 'before') {
    shellBeforeCommands.push(commandName);
  } else {
    shellAfterCommands.push(commandName);
  }
  gulp.task(commandName, function(done){
    exec(command, function (err, stdout, stderr) {
      messageVerbose(stdout);
      messageVerbose(stderr);
      done(err);
    });
  });
};

if (checkConfig('shell', c.shell)) {
  if (checkConfig('shell.before', c.shell.before)) {
    for (var i = 0; i < c.shell.before.length; i += 1) {
      addTaskShellCommand('before', c.shell.before[i], i);
    }
  }
  if (checkConfig('shell.after', c.shell.after)) {
    for (var i = 0; i < c.shell.after.length; i += 1) {
      addTaskShellCommand('after', c.shell.after[i]);
    }
  }
}

gulp.task('shell:before:message', function(done) {
  if (shellBeforeCommands.length > 0) {
    messageVerbose('');
    message('Executing before build commands');
  }
  done();
});

gulp.task('shell:after:message', function(done) {
  if (shellAfterCommands.length > 0) {
    messageVerbose('');
    message('Executing after build commands');
  }
  done();
});

gulp.task('shell:before', gulp.series(['shell:before:message'].concat(shellBeforeCommands), function(done) {
  done();
}));

gulp.task('shell:after', gulp.series(['shell:after:message'].concat(shellAfterCommands), function(done) {
  done();
}));

gulp.task('vendors:fonts', function (done) {
  if (buildIndex > 0) {
    messageVerbose('Notice', 'Vendors Fonts already built, if you need to update them, re-run the watcher');
    done();
  } else {
    if (c.vendors !== undefined && c.vendors.fonts !== undefined) {
      messageVerbose('');
      message('Copying fonts from vendors');
      var i = 0;
      for (i = 0; i < c.vendors.fonts.length; i += 1) {
        messageVerbose('Font vendor', c.vendors.fonts[i]);
        check(c.vendors.fonts[i], true);
      }
      messageVerbose('Vendor fonts copied to', c.paths.fonts);
      return gulp.src(c.vendors.fonts)
        .pipe(gulp.dest(c.paths.fonts));
    }
    messageVerbose('Notice', 'Vendor\'s Fonts not found, skipping task');
    done();
  }
});

gulp.task('vendors:images', function (done) {
  if (buildIndex > 0) {
    messageVerbose('Notice', 'Vendors Images already built, if you need to update them, re-run the watcher');
    done();
  } else {
    if (c.vendors !== undefined && c.vendors.images !== undefined) {
      messageVerbose('');
      message('Copying images from vendors');
      var i = 0;
      for (i = 0; i < c.vendors.images.length; i += 1) {
        messageVerbose('Image vendor', c.vendors.images[i]);
        check(c.vendors.images[i], true);
      }
      messageVerbose('Vendor images copied to', c.paths.images);
      return gulp.src(c.vendors.images)
      .pipe(gulp.dest(c.paths.images));
    }
    messageVerbose('Notice', 'Vendor\'s Images not found, skipping task');
    done();
  }
});

gulp.task('vendors:css', function (done) {
  if (buildIndex > 0) {
    messageVerbose('Notice', 'Vendors CSS already built, if you need to update them, re-run the watcher');
    done();
  } else {
    if (c.vendors !== undefined && c.vendors.css !== undefined) {
      messageVerbose('');
      message('Merging CSS vendors');
      var i = 0;
      for (i = 0; i < c.vendors.css.files.length; i += 1) {
        messageVerbose('CSS vendor', c.vendors.css.files[i]);
        check(c.vendors.css.files[i], true);
      }
      messageVerbose('Vendor CSS files merged to', c.paths.css + c.vendors.css.file);
      return gulp.src(c.vendors.css.files)
      .pipe(uglifyCss())
      .pipe(concat(c.vendors.css.file))
      .pipe(gulp.dest(c.paths.css));
    }
    messageVerbose('Notice', 'Vendor\'s CSS not found, skipping task');
    done();
  }
});

gulp.task('message:end', function(done){
  var stopBuildDate = Date.now();
  var timeSpent = (stopBuildDate - startBuildDate)/1000 + ' secs';

  messageVerbose('');

  message('Build ' + colors.yellow('[ ' + buildIndex + ' ]') + ' done at ' + colors.yellow(moment().format('HH:mm')) + ' and ' + colors.yellow(moment().format('ss')) + ' seconds.', true);
  message(colors.green('The dust was cleaned successfully in ' + timeSpent));

  if (isWatching) {
    messageVerbose('');
    message(colors.blue('Waiting for file changes...'));
  }

  messageVerbose('');

  buildIndex += 1;
  done();
});

gulp.task('js:build', function (done) {
  if (c.js !== undefined && c.js.files !== undefined) {
    messageVerbose('');
    message('Merging JavaScript files');
    var i = 0;
    for (i = 0; i < c.js.files.length; i += 1) {
      messageVerbose('JavaScript file', c.js.files[i]);
      check(c.js.files[i], true);
    }
    messageVerbose('JavaScript files merged to', c.paths.js + c.js.file);
    return gulp.src(c.js.files)
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat(c.js.file))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(c.paths.js));

  }
  messageVerbose('Notice', 'Vendor\'s JavaScript not found, skipping task');
  done();
});

gulp.task('vendors:build', gulp.series(['vendors:css', 'vendors:images', 'vendors:fonts'], function (done) {
  done();
}));

gulp.task('css:merge', function(done){
  var themes, mergeVendors;
  themes = [];
  messageVerbose('');
  message('Merging CSS files');

  if (c.vendors !== undefined && c.vendors.css !== undefined) {
    mergeVendors = c.vendors.css.merge !== null ? c.vendors.css.merge : true;
    if (mergeVendors) {
      messageVerbose('CSS vendors to merge', c.paths.css + c.vendors.css.file);
      themes.push(c.paths.css + c.vendors.css.file);
    } else {
      messageVerbose('CSS vendors skipped from merge', c.paths.css + c.vendors.css.file);
    }
  } else {
    messageVerbose('Notice', 'CSS vendors not found');
  }

  for (var i = 0; i < cssThemes.length; i += 1) {
    if (cssThemes[i].merge) {
      messageVerbose('CSS to merge', cssThemes[i].file);
      themes.push(cssThemes[i].file);
    } else {
      messageVerbose('CSS skipped from merge', cssThemes[i].file);
    }
  }
  if (themes.length > 0) {
    messageVerbose('All CSS files merged to', c.paths.css + c.css.file);
    return gulp.src(themes)
      .pipe(uglifyCss())
      .pipe(concat(c.css.file))
      .pipe(gulp.dest(c.paths.css));
  } else {
    messageWarning('No vendors or themes will be merged');
    done();
  }
});

gulp.task('watch:js', function () {
    var tasks = [
      'js:build'
    ];
    sequence(tasks);
    var watchList = [ c.css.watch ];
    if (c.js !== undefined && c.js.watch !== undefined) {
      watchList.push(c.js.watch);
    }
    return gulp.watch(watchList, gulp.series(tasks, function(done){ done(); }));
});

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


gulp.task('twig:html', function (done) {
  if (c.twig !== undefined && c.twig.files !== undefined) {
    var twigConfig = {};
    if (c.config !== undefined && c.config.twig !== undefined) {
      twigConfig = c.config.twig;
    }
    twigConfig.data = {
      faker: faker
    };

    messageVerbose('');
    message('Twig to HTML');
    checkConfig('paths.server', c.paths.server);
    for (var i = 0; i < c.twig.files.length; i += 1) {
      messageVerbose('Twig view', c.twig.files[i]);
    }
    messageVerbose('All Twig files converted in', c.paths.server);
    return gulp.src(c.twig.files)
      .pipe(twig(twigConfig))
      .pipe(prettify(c.prettify || {}))
      .pipe(gulp.dest(c.paths.server));
  }
  messageVerbose('Notice', 'Twig files not found, skipping task');
  done();
});

gulp.task('html:build', gulp.series(['twig:html'], function(done){
  done();
}));

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

gulp.task('css:build', gulp.series(
  themeBuildTasks.concat([
  'vendors:build',
  'css:merge'
]), function(done){
  done();
}));

gulp.task('state:watch', function(done){
  isWatching = true;
  done();
});

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

gulp.task('watch:http', function(done) {
  browserSync.stream();
  done();
});

gulp.task('http', gulp.series(['state:watch', 'watch:http'].concat(configTasks), function() {
  browserSync.init({
    server: {
        baseDir: c.paths.server
    },
    logLevel: 'info',
    notify: true
  });

  return gulp.watch(watchList(), gulp.series(configTasks, browserSync.reload))
    .on('change', function(path) {
      messageFile(phrases.change, path);
    })
    .on('unlink', function(path) {
      messageFile(phrases.unlink, path);
    })
    .on('add', function(path) {
      messageFile(phrases.add, path);
    });
}));

gulp.task('watch', gulp.series(['state:watch'].concat(configTasks), function() {
  return gulp.watch(watchList(), gulp.series(configTasks))
    .on('change', function(path) {
      messageFile(phrases.change, path);
    })
    .on('unlink', function(path) {
      messageFile(phrases.unlink, path);
    })
    .on('add', function(path) {
      messageFile(phrases.add, path);
    });
}));

gulp.task('default', gulp.series(configTasks, function(done) {
  done();
}));
