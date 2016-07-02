var task = task || {};

task.vendors = (function(){

  var name = 'vendors';
  var paths = {};
  var vendorsConfig = {};
  var vendorsFontsBuilt = false;
  var vendorsImagesBuilt = false;

  var pipeline = {
    before:[],
    middle:[],
    after:[]
  };

  var init = function() {
    paths = config.get('paths');
    vendorsConfig = config.if('vendors') ? config.get('vendors') : {};
  };

  var images = function() {
    if (task.core.has(vendorsConfig, 'images')) {
      var taskName = task.core.action(name, 'images');
      gulp.task(taskName, function (done) {
        if (vendorsImagesBuilt) {
          message.notice('Skipping vendors images build to improve speed, if you need to update them just re-run the task');
          done();
        } else {
          vendorsImagesBuilt = true;
            message.task('Copying images from vendors');
            for (var i = 0; i < vendorsConfig.images.length; i += 1) {
              message.verbose('Image vendor', vendorsConfig.images[i]);
              task.core.fileCheck(vendorsConfig.images[i]);
            }
            message.verbose('Vendor images copied to', paths.images);
            return gulp.src(vendorsConfig.images)
            .pipe(gulp.dest(paths.images));
        }
      });
      return [taskName];
    } else {
      message.warning('Vendor\'s Images not found, skipping task');
    }
    return [];
  };

  var fonts = function(){
    if (task.core.has(vendorsConfig, 'fonts')) {
      var taskName = task.core.action(name, 'fonts');
      gulp.task(taskName, function (done) {
        if (vendorsFontsBuilt) {
          message.notice('Skipping vendors images build to improve speed, if you need to update them just re-run the task');
          done();
        } else {
          vendorsFontsBuilt = true;
            message.task('Copying fonts from vendors');
            var i = 0;
            for (i = 0; i < vendorsConfig.fonts.length; i += 1) {
              message.verbose('Font vendor', vendorsConfig.fonts[i]);
              task.core.fileCheck(vendorsConfig.fonts[i]);
            }
            message.verbose('Vendor fonts copied to', paths.fonts);
            return gulp.src(vendorsConfig.fonts)
              .pipe(gulp.dest(paths.fonts));
        }
      });
      return [taskName];
    } else {
      message.warning('Vendor\'s Fonts not found, skipping task');
    }
    return [];
  };

  return {
    get: function(){
      if (!config.if('vendors')) {
        return pipeline;
      }
      init();
      pipeline.middle = pipeline.middle.concat(fonts());
      pipeline.middle = pipeline.middle.concat(images());
      return pipeline;
    }
  };
})();
