# d u s t m a n

[![Version](http://img.shields.io/:version-1.11.53-e07c4b.svg)][node] [![TravisCI](https://travis-ci.org/ideatosrl/dustman.svg?branch=master)](https://travis-ci.org/ideatosrl/dustman/builds) [![Built with nodejs 5.4.1](http://img.shields.io/:nodejs-5.4.1-80BD01.svg)](https://nodejs.org/en/) [![NPM](http://img.shields.io/:NPM-package-C12127.svg)][node] [![MIT licence](http://img.shields.io/:license-MIT-00AFFF.svg)](https://github.com/vitto/dustman/blob/master/LICENSE.md)

--------------------------------------------------------------------------------

## Release 1.11.X details

Type    | Description
------- | ----------------------------------------------------------
fix     | Changes node dependencies for compatibility reasons
fix     | Update node dependencies
feature | Build process is now integrated with desktop notifications

--------------------------------------------------------------------------------

**Gulp + YAML config** based front-end **automation boilerplate**

--------------------------------------------------------------------------------

Dustman is basically a set of Gulp tasks ready to be used as a build system which helps you to:

## Build CSS

- **Build [SASS] or [LESS]** autodetected with multiple themes.
- Dynamic tasks with **selective [YAML] configuration** for every theme.
- **[CSSlint]** tests.
- **[StyleStats]** reports.
- **[Autoprefixer]** for automated multiple browser support.
- CSS vendors and assets already optimized for production environments.
- Everything **minimized** in one file and with **map** support.

## Build JavaScript

- Apps with dependencies in sequence you need.
- Everything **minimized** in one file and with **map** support.

## Build HTML

- **Build [Twig] templates** to HTML pages.
- **[BrowserSync]** ready to be tested on multiple devices.
- **[Faker]** ready to be used to add fake contents easily.
- **[Moment]** ready to be used with faker to format dates easily.
- **[HTML prettified][htmlprettify]** to have consistently coded HTML templates.

## Watch and Serve with HTTP server

- **Watch files** automation tasks listeners to update your build automatically.
- **BrowserSync** support to check CSS, JavaScript and HTML coded.

--------------------------------------------------------------------------------

### Gulp 4 alpha

At the moment Dustman is based on **[Gulp 4][gulp] which is in alpha release status** so use it on your own risk! I didn't noticed any problems, but I didn't tested it in many environments.

### Why Gulp 4?

- Because it has a **superior task concatenation** system compared to the previous major release.
- Because the watcher and the build system are **faster**.

--------------------------------------------------------------------------------

# Installation

The installation command will install `dustman` module in your package file and copy the dustman files to your project directory:

```
npm install --save dustman
cp -i ./node_modules/dustman/dustman.yml dustman.yml
cp -i ./node_modules/dustman/gulpfile.js gulpfile.js
```

The flag `-i` will prompt if you want to overwrite an existing file in the target directory.

--------------------------------------------------------------------------------

# Build suite

Dustman has a set of **main tasks** which uses a set of **sub tasks** in sequence.

## Main tasks

The idea behind Dustman is to use a set of Gulp **main tasks** which shouldn't be changed, and decide how to build by adding or removing the **sub tasks** listed in the `tasks` YAML configuration.

### Default

```bash
$ gulp
```

You can choose a different config by using `--config` paramter.

```bash
$ gulp --config another-config.yml
```

All tasks can run locally with `./node_modules/.bin/gulp taskname` in the tasks table will be used `gulp taskname` to be easy to read.

```bash
$ ./node_modules/.bin/gulp --config another-config.yml --silent
```

Note: Tasks with `--silent` or `-S` flag will stop firing Gulp task logs, but **you can miss errors not checked by dustman**.

--------------------------------------------------------------------------------

### Watcher

If `js.watch`, `css.watch` and `html.watch` watched folder's files changes, the watcher will perform a new build.

```bash
$ gulp watch
```

The abbreviation command for `watch` is `w`

```bash
$ gulp w
```

--------------------------------------------------------------------------------

### Server + watcher

If `js.watch`, `css.watch` and `html.watch` watched folder's files changes, the watcher will perform a new build.

A server based on browser sync node module will serve the HTML templates.

```bash
$ gulp http
```

The abbreviation command for `http` is `h`

```bash
$ gulp h
```

# Sub tasks

In the `dustman.yml` config, you can select the tasks (`css`, `js` or `html`) to be used to choose what will be built.

```yaml
tasks:
  - css
  - js
#  - html # skip HTML tasks
```

# Shell commands

You can run shell commands with `shell` parameters in config:

```yaml
shell:
  before:
    - echo before build task command 01
    - echo before build task command 02
  after:
    - echo after build task command
```

--------------------------------------------------------------------------------

## JavaScript task file generator

If you use this YAML config:

```yaml
js:
  file: dustman.min.js
  files:
    - my/js/development/file.js
  vendors:
    file: vendors.min.js
    merge: true
    files:
      - vendor/angular/angular.js
```

Dustman will generate these files:

```
dustman.min.js # [ dev files + vendors ]
dustman.no-vendors.min.js # [ dev files only ]
vendors.min.js # [ vendors only, used for caching vendors and skip its build time ]
```

--------------------------------------------------------------------------------

If you use this YAML config:

```yaml
js:
  file: dustman.min.js
  files:
    - my/js/development/file.js
  vendors:
    file: vendors.min.js
    merge: false
    files:
      - vendor/angular/angular.js
```

Dustman will generate these files:

```
dustman.min.js # [ dev files only ]
vendors.min.js # [ vendors only, will be generated only the first time ]
```

--------------------------------------------------------------------------------

# Config example

```yaml
---

tasks:
  - css  # optional [skipped]
  - js   # optional [skipped]
  - html # optional [skipped]

config:
  autoprefixer: # optional [defaults]
    browsers:
      - last 3 versions
  csslint: csslintrc.json # optional [defaults]
  stylestats: .stylestatsrc # optional [defaults]
  prettify: # optional [defaults]
    indent_char: ' '
    indent_size: 2
  faker: # optional [defaults]
    locale: it
  twig: # optional [defaults]
    cache: false
  osNotifications: true # optional [true]
  emptyFolders: false # optional [true]
  polling: 500 # optional [false]
  verify: true # optional [false]
  verbose: 3 # optional [3]

css: # optional [required by sub task css if used]
  file: themes-with-vendors.min.css # optional [dustman.min.css]
  watch: my/sass/files/**/*.scss # optional [./**/*.scss]
  path: my/sass/path/ # optional [inherit path.css]
  themes:
    -
      name: theme-one # optional [theme-0]
      file: theme-one.css # optional [theme-0.css]
      compile: my/sass/files/theme-one/import.scss
      images: my/sass/files/themes/default/img/**/*.* # optional [skipped]
      fonts: my/sass/files/themes/default/img/**/*.* # optional [skipped]
      csslint: true # optional [false]
      path: my/sass/path/ # optional [inherit path.css]
      stylestats: true # optional [false]
      autoprefixer: true # optional [false]
    -
      name: theme-two # optional [theme-1]
      file: theme-two.css # optional [theme-1.css]
      compile: my/sass/files/theme-two/import.scss
      csslint: false # optional [false]
      stylestats: false # optional [false]
      autoprefixer: false # optional [false]
  vendors: # optional
    file: vendors.min.css
    merge: true  # optional [true]
    path: custom/path/ # optional [inherit path.css]
    files:
      - vendor/angular/angular-csp.css
      - vendor/angular-bootstrap/ui-bootstrap-csp.css
      - vendor/font-awesome/css/font-awesome.css
      - vendor/angular-chart.js/dist/angular-chart.css

js: # optional [required by sub task js if used]
  file: app-with-vendors.min.js # optional [dustman.min.js]
  watch: my/js/files/**/*.js # optional [./**/*.js]
  merge: true # optional [true]
  path: my/sass/path/ # optional [inherit path.js]
  files:
    - my/js/files/*
  vendors: # optional
    file: vendors.min.js
    path: custom/path/ # optional [inherit path.js]
    merge: true # optional [true]
    files:
      - vendor/angular/angular.js
      - vendor/angular-animate/angular-animate.js
      - vendor/angular-bootstrap/ui-bootstrap-tpls.js
      - vendor/angular-bootstrap/ui-bootstrap.js
      - vendor/Chart.js/Chart.js
      - vendor/angular-chart.js/dist/angular-chart.js
      - vendor/angular-cookies/angular-cookies.js
      - vendor/angular-dynamic-locale/dist/tmhDynamicLocale.js
      - vendor/angular-flash/angular-flash.js
      - vendor/angular-route/angular-route.js

shell: # optional [skipped]
  before: # optional [skipped]
    - echo before build task command 01
    - echo before build task command 02
  after: # optional [skipped]
    - echo after build task command

vendors: # optional [skipped]
  fonts: # optional [skipped]
    - vendor/font-awesome/fonts/fontawesome-webfont.eot
    - vendor/font-awesome/fonts/fontawesome-webfont.svg
    - vendor/font-awesome/fonts/fontawesome-webfont.ttf
    - vendor/font-awesome/fonts/fontawesome-webfont.woff
    - vendor/font-awesome/fonts/fontawesome-webfont.woff2
    - vendor/font-awesome/fonts/FontAwesome.otf
  images: # optional [skipped]
    - vendor/font-awesome/fonts/fontawesome-webfont.svg

html: # optional [required by sub task html if used]
  engine: twig # optional [html]
  fixtures: # optional [false]
    images: images.json
    foo: foo.json
  watch: test/examples/twig/**/*.twig
  files:
    - test/examples/twig/index.twig

paths:
  server: my/build/
  css: my/build/css/
  images: my/build/img/
  fonts: my/build/fonts/
  js: my/build/js/
```

--------------------------------------------------------------------------------

# Load a sub config file

Now it's possible to load config portions based on task type

```yaml
---

tasks:
  - css
  - html
  - js

config: path/relative/to/this/config.yml
css: path/relative/to/this/config.yml
html: path/relative/to/this/config.yml
js: path/relative/to/this/config.yml
paths: path/relative/to/this/config.yml
vendors: path/relative/to/this/config.yml
shell: path/relative/to/this/config.yml
```

--------------------------------------------------------------------------------

# Config parameters

## Config

Config parameters with links comes from related plug-in configurations

Parameter                | Example value         | Type      | Description
------------------------ | --------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------
`config`                 | _mixed_               | _Object_  | It contains CSS options
`config.autoprefixer`    | _mixed_               | _Object_  | [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)
`config.csslint`         | _path/csslintrc.json_ | _String_  | It contains CSSlint options path
`config.emptyFolders`    | _true_                | _Boolean_ | Deletes file contents inside `paths.server` to keep the build clean
`config.faker`           | _mixed_               | _Object_  | [https://github.com/marak/Faker.js/][faker]
`config.prettify`        | _mixed_               | _Object_  | [https://www.npmjs.com/package/gulp-html-prettify][htmlprettify]
`config.stylestats`      | _path/.stylestatsrc_  | _String_  | It contains Stylestats options path
`config.twig`            | _mixed_               | _Object_  | [gulp-twig](https://www.npmjs.com/package/gulp-twig)
`config.osNotifications` | _true_                | _Boolean_ | Enables OS desktop notifications
`config.polling`         | _500_                 | _mixed_   | Set millisecs of polling to the Gulp watcher to prevent missing Vagrant NFS filesync with local system and VM, it's `false` by default
`config.verbose`         | _3_                   | _Integer_ | The verbose value, 0: no messages, 3: all message logs
`config.verify`          | _true_                | _Boolean_ | Checks if all dustman generated files are created on the machine

## CSS

Parameter                   | Example value        | Type      | Description
--------------------------- | -------------------- | --------- | ----------------------------------------------------------------------------
`css`                       | _mixed_              | _Object_  | It contains CSS options
`css.file`                  | _dustman.min.css_    | _String_  | The name of the merged and minified CSS with vendors and SASS or LESS themes
`css.path`                  | _path/to/css/_       | _String_  | If this theme should be built in a specific folder
`css.themes`                | _mixed_              | _Array_   | It contains theme with it's config
`css.themes`                | _mixed_              | _Array_   | It contains theme object with it's config
`css.themes[].autoprefixer` | _true_               | _Boolean_ | If the build will add prefixes to the CSS theme
`css.themes[].compile`      | _-path/theme.sass_   | _String_  | Path to the CSS theme, can be SASS or LESS
`css.themes[].csslint`      | _true_               | _Boolean_ | If theme need to be tested
`css.themes[].file`         | _theme-name.min.css_ | _String_  | The name of the single theme built
`css.themes[].fonts`        | _path/__/_.**        | _String_  | Fonts path related to theme
`css.themes[].images`       | _path/__/_.**        | _String_  | Images path related to theme
`css.themes[].merge`        | _true_               | _Boolean_ | If this theme should be in the final merged CSS file
`css.themes[].name`         | _theme-name_         | _String_  | The name will be listed in the build logs, based on `config.verbose`
`css.themes[].path`         | _path/to/css/_       | _String_  | If this theme should be built in a specific folder
`css.themes[].stylestats`   | _true_               | _Boolean_ | If this theme is passed to stylestats report
`css.vendors`               | _mixed_              | _Object_  | It contains CSS vendors options
`css.vendors.file`          | _vendors.min.css_    | _String_  | The name of the merged and minified vendors CSS
`css.vendors.merge`         | _true_               | _Boolean_ | If vendors will be merged into the final CSS file
`css.vendors.files`         | _-vendors/file.css_  | _Array_   | Files listed for the merged CSS vendors build
`css.watch`                 | _path/__/_.js*       | _String_  | Files watched from the main task watcher

## JavaScript

Parameter          | Example value       | Type      | Description
------------------ | ------------------- | --------- | -----------------------------------------------------------------------------------------
`js`               | _mixed_             | _Object_  | It contains JavaScript options
`js.file`          | _dustman.min.js_    | _String_  | The name of the merged and minified JavaScript
`js.path`          | _path/to/js/_       | _String_  | If this theme should be built in a specific folder
`js.watch`         | _path/__/_.js*      | _String_  | Files watched from the main task watcher
`js.files`         | _-path/file.js_     | _Array_   | Files listed for the JavaScript build, it can also be a conatiner path like `-path/app/*`
`js.vendors`       | _mixed_             | _Object_  | It contains CSS vendors options
`js.vendors.file`  | _vendors.min.js_    | _String_  | The name of the merged and minified vendors JS
`js.vendors.merge` | _true_              | _Boolean_ | If vendors will be merged into the final JS file
`js.vendors.files` | _-vendors/file.css_ | _Array_   | Files listed for the merged JS vendors build

## Paths

Parameter      | Example value          | Type     | Description
-------------- | ---------------------- | -------- | --------------------------------------------------------------------------------------
`paths`        | _mixed_                | _Object_ | It contains build path targets
`paths.server` | _path/to/html/_        | _String_ | Path where the **Browser sync** local server will point and **Twig** will be generated
`paths.css`    | _path/to/html/css/_    | _String_ | Where **CSS files** will be moved from source targets to the production folders
`paths.images` | _path/to/html/images/_ | _String_ | Where **images files** will be moved from source targets to the production folders
`paths.fonts`  | _path/to/html/fonts/_  | _String_ | Where **fonts files** will be moved from source targets to the production folders
`paths.js`     | _path/to/html/js/_     | _String_ | Where **js files** will be moved from source targets to the production folders

## Shell

Shell node module doesn't seems to support every command

Parameter      | Example value   | Type     | Description
-------------- | --------------- | -------- | -------------------------------------------------------------------
`shell`        | _mixed_         | _Object_ | It contains shell tasks options
`shell.before` | _-bash command_ | _Array_  | Bash commands will be executed in series **before** the build tasks
`shell.after`  | _-bash command_ | _Array_  | Bash commands will be executed in series **after** the build tasks

## Tasks

Parameter | Example value | Type    | Description
--------- | ------------- | ------- | -------------------------------------------------
`tasks`   | _-css_        | _Array_ | It contains the sub tasks pipeline build sequence

You can add `css`, `js` and `html`

## HTML

Parameter       | Example value     | Type     | Description
--------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`html`          | _mixed_           | _Object_ | It contains twig options
`html.engine`   | _twig_            | _String_ | The engine used, [Twig] or HTML for now (html by default)
`html.watch`    | _path/__/_.twig*  | _String_ | Files watched from the main task watcher
`html.files`    | _-path/file.twig_ | _Array_  | Files listed for the HTML build
`html.fixtures` | _mixed_           | _Object_ | A list of property which points to json files that will be loaded with the same property name, if you set `fixtures.images` to `images.json` in the twig you'll get json contents `{{ fixtures.images[0].title }}`

## Vendors

Parameter        | Example value        | Type     | Description
---------------- | -------------------- | -------- | ----------------------------------------------------
`vendors`        | _mixed_              | _Object_ | It contains vendors options
`vendors.fonts`  | _-vendors/font.ttf_  | _Array_  | Files listed to be moved on fonts production folder
`vendors.images` | _-vendors/image.svg_ | _Array_  | Files listed to be moved on images production folder

--------------------------------------------------------------------------------

# Previous release details

## Release 1.10.X details

Type    | Description
------- | ----------------------------------------------------------------------------------------------
fix     | Skips removing build folder if it's the first build process
fix     | Check if `emptyFolders` is set to prevent removed vendors after the first build of the watcher
feature | Build folders are automatically emptied, can be skipped with `confing.emptyFolders`

## Release 1.9.X details

Type         | Description
------------ | ---------------------------------------------------------------------------------------------
fix          | Fixes fixtures path
optimization | Now you can load configs for `config`, `paths`, `tasks`, `shell` and `vendors` properties too
feature      | TWIG can load json fixtures

## Release 1.8.X details

Type    | Description
------- | ------------------------------
feature | Config can load another config

## Release 1.7.X details

Type         | Description
------------ | --------------------------
optimization | Updates node packages
fix          | Fix css task when not used
feature      | Adds moment to twig

### Release 1.6.X details

Type   | Description
------ | ----------------------------------------------------------------
change | Moves to node_modules temp folders no-vendors.js file when built

## Release 1.5.X details

Type         | Description
------------ | ----------------------------------------------------------------------------------
fix          | Wrong polling settings if disabled
fix          | Now JS task can be with vendors only
fix          | Adds a missing warning if `-S` flag is passed to Gulp task
optimization | Adds abbreviation command for Gulp's `http` task, now can be called just with `h`
optimization | Adds abbreviation command for Gulp's `watch` task, now can be called just with `w`
fix          | Corrects a wrong file check on CSS task for verify task
fix          | Ensure CSS and JS tasks can be empty also on files verify task
fix          | Ensure HTML task can be empty also on files verify task
optimization | Files list concatentation is more easy to read
optimization | Adds toString to message logs
optimization | Adds toString to path errors
optimization | Now vendors are disabled by default to ensure CSS and JS vendors to be optional
fix          | CSS and JS vendors now are optional
fix          | Fix wrong file path on JS vendors save
feature      | Adds additional path properties to css and js tasks

## Release 1.4.X details

Type         | Description
------------ | -------------------------------------------------------------------
fix          | Check between system node version and required version correctly
fix          | Removed old task name twig for html to verify files correctly
optimization | Add system node version check to notify if it's too old
optimization | Add timed to important messages to be more easy to read
fix          | Fix wrong task error for watched dustman folders
fix          | Fix missing config file message
optimization | Added missing vendors warning if it's thrown a file not found error
test         | Added travis tests
feature      | Added engine selection for HTML build

## Release 1.3.X details

Type    | Description
------- | -----------------------------------------------------------------------------------------------------
feature | Added polling option to Gulp watcher to prevent missing Vagrant NFS filesync with local system and VM

## Release 1.2.X details

Type            | Description
--------------- | -----------------------------------------------------------------------------
fix             | Optimized files verification to be of their relative task modules
coding standard | Remove unused comments
fix             | Fix shell tasks not started properly
feature         | Now it's possible to verify files built to ensure everything work as expected

## Release 1.1.X details

Type         | Description
------------ | -----------------------------------------------------------------------
optimization | If JS or CSS vendor files are removed they will be built again
fix          | Fix wrong name notice log for fonts vendors
fix          | Fix vendors assets always skipping from build
fix          | Fix wrong default JavaScript path for vendors
fix          | Decommented missing minimized JavaScript files
optimization | Task logs are more consistent
optimization | Critical build speed improvement, with vendors cached after first build
change       | Change how CSS and JavaScript vendors are built

--------------------------------------------------------------------------------

Dustman is coded with love by [vitto] @ [ideato]

[autoprefixer]: https://github.com/postcss/autoprefixer
[browsersync]: https://www.browsersync.io/
[csslint]: https://github.com/CSSLint/csslint
[faker]: https://github.com/marak/Faker.js/
[gulp]: http://gulpjs.com/
[htmlprettify]: https://www.npmjs.com/package/gulp-html-prettify
[ideato]: http://www.ideato.it
[less]: http://lesscss.org/
[node]: https://www.npmjs.com/package/dustman
[sass]: http://sass-lang.com/
[stylestats]: https://github.com/t32k/stylestats
[twig]: http://twig.sensiolabs.org/
[vitto]: https://github.com/vitto
[yaml]: http://yaml.org/
