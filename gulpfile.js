var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'), // https://github.com/sindresorhus/gulp-autoprefixer
  analyzer     = require('analyze-css'), // https://github.com/macbre/analyze-css
  colors       = require('colors'),
  concat       = require('gulp-concat'),
  csslint      = require('gulp-csslint'),
  moment       = require('moment'),
  plugins      = require('gulp-load-plugins')(),
  run          = require('run-sequence'),
  sass         = require('gulp-sass'),
  jshint       = require('gulp-jshint'), // https://github.com/spalger/gulp-jshint
  sourcemaps   = require('gulp-sourcemaps'),
  stylestats   = require('gulp-stylestats'),
  uglify       = require('gulp-uglify'),
  uglifyCss    = require('gulp-uglifycss'),
  yaml         = require('js-yaml'),
  fs           = require('fs'),
  browserSync  = require('browser-sync');

var c, buildIndex, buildTasks, themesTotal, cssThemes;

c = false;
buildIndex = 0;
buildTasks = [];
cssThemes = [];

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

if (c.dustman === undefined) {
  console.log(colors.red('Error: object dustman is NOT present in YAML configuration.'));
  process.exit();
}

themesTotal = c.dustman.themes.length;

var messageVerbose = function(title, message) {
  if (c.dustman.verbose !== undefined && c.dustman.verbose >= 3) {
    if (message !== undefined) {
      console.log(colors.yellow(title.trim() + ': ') + message.trim());
    } else {
      console.log(colors.yellow(title.trim()));
    }
  }
};

var message = function(message, force) {
  if (force !== undefined && force || c.dustman.verbose !== undefined && c.dustman.verbose >= 2) {
    console.log(message);
  }
};

var messageError = function(message) {
  if (c.dustman.verbose !== undefined && c.dustman.verbose >= 1) {
    console.log(colors.red('Error: ') + message.trim());
  }
};

var taskPrefix = function(themeName, action) {
  return 'frontsize:theme:' + themeName + ':' + action;
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

var addTask = function(theme, index){

  var compile, file, name, prefixAutoprefixer, reportStylestats, testCsslint, images, fonts, destinationPath, task, tasksToBuild, testCsslintTasks, reportStylestatsTasks, buildDependecies;

  compile = theme.compile;
  file = theme.file;
  name = theme.name;
  images = theme.images || false;
  fonts = theme.fonts || false;
  prefixAutoprefixer = c.config.autoprefixer ? theme.autoprefixer ? true : false : false;
  reportStylestats = c.config.stylestats ? theme.stylestats ? true : false : false;
  testCsslint = c.config.csslint ? theme.csslint ? true : false : false;

  destinationPath = c.paths.css;

  testCsslintTasks = ['css'];
  reportStylestatsTasks = ['testCsslint'];

  tasksToBuild = ['build', 'css'];

  if (images) {
    tasksToBuild.push('images');
    reportStylestatsTasks.push('images');
    testCsslintTasks.push('images');
  }
  if (fonts) {
    tasksToBuild.push('fonts');
    reportStylestatsTasks.push('fonts');
    testCsslintTasks.push('fonts');
  }
  if (testCsslint) { tasksToBuild.push('testCsslint'); }
  if (reportStylestats) { tasksToBuild.push('reportStylestats'); }

  task = tasks(theme, tasksToBuild);
  tasksToBuild = tasksToBuild.splice(1);
  buildTasks.push(task.build);

  gulp.task(task.css, function () {
    if (buildIndex === 0 && index > 0 ) {
      messageVerbose('');
    }
    message('Theme name: ' + colors.blue(name));

    if (themesTotal >= 1) {
      messageVerbose('Theme task', (index + 1) + ' of ' + themesTotal);
    }
    messageVerbose('File', destinationPath + file);
    cssThemes.push(destinationPath + file);
    if (prefixAutoprefixer) {
      messageVerbose('Autoprefixer', 'Enabled');
      return gulp.src(compile)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(concat(file))
        .pipe(sourcemaps.write('./'))
        .pipe(autoprefixer(prefixAutoprefixer))
        .pipe(gulp.dest(destinationPath));
    } else {
      messageVerbose('Autoprefixer', 'Disabled');
      return gulp.src(compile)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(concat(file))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(destinationPath));
    }
  });

  if (testCsslint) {
    gulp.task(task.testCsslint, tasksList(theme, testCsslintTasks), function () {
      messageVerbose('');
      message('CSSlint', file);
      messageVerbose('Testing theme', name);
      return gulp.src(destinationPath + file)
        .pipe(csslint(c.config.csslint))
        .pipe(csslint.reporter());
    });
  } else {
    reportStylestatsTasks = testCsslintTasks;
  }

  if (reportStylestats) {
    gulp.task(task.reportStylestats, [task.css], function () {
      // messageVerbose('');
      // message('Stylestats', file);
      // messageVerbose('Report for theme', name);
      return gulp.src(destinationPath + file)
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

  buildDependecies = tasksList(theme, tasksToBuild);
  buildDependecies = buildTasks.slice(0, buildTasks.length-1).concat(buildDependecies);

  gulp.task(task.build, function(){
    run(buildDependecies);
  });
};

if (c.dustman !== undefined && c.dustman.themes) {
  message('', true);
  message(colors.red('  D U S T MAN   0.0.11'), true);
  message('', true);
  for (var t = 0; t < c.dustman.themes.length; t += 1) {
    addTask(c.dustman.themes[t], t);
  }
}

gulp.task('frontsize:vendors:fonts', function () {
  if (c.vendors !== undefined && c.vendors.fonts !== undefined) {
    messageVerbose('');
    message('Copying fonts from vendors');
    var i = 0;
    for (i = 0; i < c.vendors.fonts.length; i += 1) {
      messageVerbose('Font vendor', c.vendors.fonts[i]);
    }
    messageVerbose('Vendor fonts copied to', c.paths.fonts);
    return gulp.src(c.vendors.fonts)
      .pipe(gulp.dest(c.paths.fonts));
  } else {
    messageVerbose('Notice', 'Vendor\'s Fonts not found, skipping task');
    return gulp;
  }
});

gulp.task('frontsize:vendors:images', function () {
  if (c.vendors !== undefined && c.vendors.images !== undefined) {
    messageVerbose('');
    message('Copying images from vendors');
    var i = 0;
    for (i = 0; i < c.vendors.images.length; i += 1) {
      messageVerbose('Image vendor', c.vendors.images[i]);
    }
    messageVerbose('Vendor images copied to', c.paths.images);
    return gulp.src(c.vendors.images)
      .pipe(gulp.dest(c.paths.images));
  } else {
    messageVerbose('Notice', 'Vendor\'s Images not found, skipping task');
    return gulp;
  }
});

gulp.task('frontsize:js', function () {
  if (c.js !== undefined && c.js.files !== undefined) {
    messageVerbose('');
    message('Merging JavaScript files');
    var i = 0;
    for (i = 0; i < c.js.files.length; i += 1) {
      messageVerbose('JavaScript file', c.js.files[i]);
    }
    messageVerbose('JavaScript files merged to', c.paths.js + c.js.file);
    return gulp.src(c.js.files)
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat(c.js.file))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(c.paths.js));

  } else {
    messageVerbose('Notice', 'Vendor\'s JavaScript not found, skipping task');
    return gulp;
  }
});

gulp.task('js:watch', function () {
    var tasks = [
      'frontsize:js'
    ];
    run(tasks);
    var watchList = [ c.dustman.watch ];
    if (c.js !== undefined && c.js.watch !== undefined) {
      watchList.push(c.js.watch);
    }
    return gulp.watch(watchList, tasks);
});

gulp.task('frontsize:vendors', function () {
  var tasks = [
    'frontsize:vendors:css',
    'frontsize:vendors:fonts',
    'frontsize:vendors:images'
  ];
  run(tasks);
});

gulp.task('frontsize:vendors:css', function () {
  if (c.vendors !== undefined && c.vendors.css !== undefined) {
    messageVerbose('');
    message('Merging CSS vendors');
    var i = 0;
    for (i = 0; i < c.vendors.css.files.length; i += 1) {
      messageVerbose('CSS vendor', c.vendors.css.files[i]);
    }
    messageVerbose('Vendor CSS files merged to folder', c.paths.css);
    return gulp.src(c.vendors.css.files)
      .pipe(uglifyCss())
      .pipe(concat(c.vendors.css.file))
      .pipe(gulp.dest(c.paths.css));
  } else {
    messageVerbose('Notice', 'Vendor\'s CSS not found, skipping task');
    return gulp;
  }
});

gulp.task('frontsize:merge:css', buildTasks.concat(['frontsize:vendors:css']), function () {
  if (c.vendors !== undefined && c.vendors.css !== undefined) {
    messageVerbose('');
    message('Merging all CSS files');
    messageVerbose('CSS to merge', c.paths.css + c.vendors.css.file);
    for (var i = 0; i < cssThemes.length; i += 1) {
      messageVerbose('CSS to merge', cssThemes[i]);
    }
    var css = [c.paths.css + c.vendors.css.file].concat(cssThemes);
    return gulp.src(css)
      .pipe(uglifyCss())
      .pipe(concat(c.dustman.file))
      .pipe(gulp.dest(c.paths.css));
  } else {
    messageVerbose('Notice', 'CSS vendors not found, skipping merge');
    return gulp;
  }
});

gulp.task('frontsize:merge', ['frontsize:merge:css']);

gulp.task('frontsize:http', function() {
  browserSync.init({
    server: {
        baseDir: c.server.path
    },
    logLevel: 'info',
    notify: true
  });

  run('frontsize:watch:http');

  var watchList = [
    c.paths.server + '**/*.html',
    c.paths.css + '**/*.css',
    c.paths.images + '**/*',
    c.paths.js + '**/*.js'
  ];
  gulp.watch(watchList).on('change', browserSync.reload);
});

gulp.task('frontsize:watch:http', ['frontsize:watch'], function() {
  return browserSync.stream();
});

gulp.task('frontsize:watch:message:start', function () {
  if (buildIndex === 0) {
    message('Starting build process...');
  } else {
    messageVerbose('Event', 'Hey, something changed, wait some moment...');
  }
});

gulp.task('frontsize:watch:message:end', buildTasks, function () {
  buildIndex += 1;
  message('Build ' + colors.yellow('[ ' + buildIndex + ' ]') + ' done at ' + colors.yellow(moment().format('HH:mm')) + ' and ' + colors.yellow(moment().format('ss')) + ' seconds.', true);
  message(colors.green('Tasks successfully finished'));
  message('Waiting for file changes...');
});

gulp.task('frontsize:watch', function () {
  var tasks = [
    'frontsize:watch:message:start',
    'frontsize:build',
    'frontsize:watch:message:end'
  ];
  run(tasks);
  var watchList = [ c.dustman.watch ];
  if (c.js !== undefined && c.js.watch !== undefined) {
    watchList.push(c.js.watch);
  }
  return gulp.watch(watchList, tasks);
});

gulp.task('frontsize:build', function(){
  // 'frontsize:js'
  // 'frontsize:vendors'
  var tasks = [
    'frontsize:vendors',
    'frontsize:js',
    'frontsize:merge'
  ];
  run(buildTasks.concat(tasks));
});

gulp.task('default', function(){
  run('frontsize:build');
});
