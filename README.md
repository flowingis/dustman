d u s t m a n
---

[![Version](http://img.shields.io/:version-1.4.25-e07c4b.svg)][node]
[![TravisCI](https://travis-ci.org/ideatosrl/dustman.svg?branch=master)](https://travis-ci.org/ideatosrl/dustman/builds)
[![Built with nodejs 5.4.1](http://img.shields.io/:nodejs-5.4.1-80BD01.svg)](https://nodejs.org/en/)
[![NPM](http://img.shields.io/:NPM-package-C12127.svg)][node]
[![MIT licence](http://img.shields.io/:license-MIT-00AFFF.svg)](https://github.com/vitto/dustman/blob/master/LICENSE.md)

---

##### Release 1.4.X details

| Type    | Description  |
|---------|--------------|
| fix          | Removed old task name twig for html to verify files correctly |
| optimization | Add system node version check to notify if it's too old |
| optimization | Add timed to important messages to be more easy to read |
| fix          | Fix wrong task error for watched dustman folders |
| fix          | Fix missing config file message |
| optimization | Added missing vendors warning if it's thrown a file not found error |
| test         | Added travis tests |
| feature      | Added engine selection for HTML build |

---

**Gulp + YAML config** based front-end **automation boilerplate**

---

Dustman is basically a set of Gulp tasks ready to be used as a build system which helps you to:

### Build CSS
- **Build [SASS][sass] or [LESS][less]** autodetected with multiple themes.
- Dynamic tasks with **selective [YAML][yaml] configuration** for every theme.
- **[CSSlint][csslint]** tests.
- **[StyleStats][stylestats]** reports.
- **[Autoprefixer][autoprefixer]** for automated multiple browser support.
- CSS vendors and assets already optimized for production environments.
- Everything **minimized** in one file and with **map** support.

### Build JavaScript
- Apps with dependencies in sequence you need.
- Everything **minimized** in one file and with **map** support.


### Build HTML
- **Build [Twig][twig] templates** to HTML pages.
- **[BrowserSync][browsersync]** ready to be tested on multiple devices.
- **[Faker][faker]** ready to be used to add fake contents easily.
- **[HTML prettified][htmlprettify]** to have consistently coded HTML templates.

### Watch and Serve with HTTP server
- **Watch files** automation tasks listeners to update your build automatically.
- **BrowserSync** support to check CSS, JavaScript and HTML coded.

---

##### Gulp 4 alpha

At the moment Dustman is based on **[Gulp 4][gulp] which is in alpha release status** so use it on your own risk! I didn't noticed any problems, but I didn't tested it in many environments.

##### Why Gulp 4?

- Because it has a **superior task concatenation** system compared to the previous major release.
- Because the watcher and the build system are **faster**.

---

# Installation

The installation command will install `dustman` module in your package file and copy the dustman files to your project directory:

```
npm install --save dustman
cp -i ./node_modules/dustman/dustman.yml dustman.yml
cp -i ./node_modules/dustman/gulpfile.js gulpfile.js
```

The flag `-i` will prompt if you want to overwrite an existing file in the target directory.

---

# Build suite

Dustman has a set of **main tasks** which uses a set of **sub tasks** in sequence.

### Main tasks

The idea behind Dustman is to use a set of Gulp **main tasks** which shouldn't be changed, and decide how to build by adding or removing the **sub tasks** listed in the `tasks` YAML configuration.

#### Default

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

---

#### Watcher

If `js.watch`, `css.watch` and `html.watch` watched folder's files changes, the watcher will perform a new build.

```bash
$ gulp watch
```

---

#### Server + watcher

If `js.watch`, `css.watch` and `html.watch` watched folder's files changes, the watcher will perform a new build.

A server based on browser sync node module will serve the HTML templates.

```bash
$ gulp http
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

---

### Tasks dependency trees

```bash
──┬ default
  └─┬─┬ shell:before
    ├─┬ css
    ├── js
    ├─┬ html
    └─┬ shell:after
──┬ http
  └─┬─┬ shell:before
    ├─┬ css
    ├── js
    ├─┬ html
    ├─┬ shell:after
    └── watch:http
──┬ watch
  └─┬─┬ shell:before
    ├─┬ css
    ├── js
    ├─┬ html
    └─┬ shell:after
```

---

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
  polling: 500 # optional [false]
  verify: true # optional [false]
  verbose: 3 # optional [3]

css: # optional [required by sub task css if used]
  file: themes-with-vendors.min.css # optional [dustman.min.css]
  watch: my/sass/files/**/*.scss # optional [./**/*.scss]
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
  vendors:
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

---

# Config parameters

#### Config

Config parameters with links comes from related plug-in configurations

| Parameter            | Example value        | Type      | Description                     |
| -------------------- | -------------------- | --------- | ------------------------------- |
| `config` | *mixed* | *Object* | It contains CSS options |
| `config.autoprefixer` | *mixed* | *Object*  | https://www.npmjs.com/package/gulp-autoprefixer         |
| `config.csslint` | *path/csslintrc.json* | *String* | It contains CSSlint options path |
| `config.faker` | *mixed* | *Object* | https://github.com/marak/Faker.js/ |
| `config.prettify` | *mixed* | *Object* | https://www.npmjs.com/package/gulp-html-prettify |
| `config.stylestats` | *path/.stylestatsrc* | *String* | It contains Stylestats options path |
| `config.twig` | *mixed* | *Object* | https://www.npmjs.com/package/gulp-twig |
| `config.polling` | *500* | *mixed* | Set millisecs of polling to the Gulp watcher to prevent missing Vagrant NFS filesync with local system and VM, it's `false` by default |
| `config.verbose` | *3* | *Integer* | The verbose value, 0: no messages, 3: all message logs |
| `config.verify` | *true* | *Boolean* | Checks if all dustman generated files are created on the machine |

#### CSS

| Parameter            | Example value        | Type      | Description                     |
| -------------------- | -------------------- | --------- | ------------------------------- |
| `css`                | *mixed*              | *Object*  | It contains CSS options         |
| `css.file` | *dustman.min.css* | *String* | The name of the merged and minified CSS with vendors and SASS or LESS themes |
| `css.themes` | *mixed* | *Array*   | It contains theme with it's config |
| `css.themes` | *mixed* | *Array*   | It contains theme object with it's config |
| `css.themes[].autoprefixer` | *true*  | *Boolean* | If the build will add prefixes to the CSS theme |
| `css.themes[].compile` | *-path/theme.sass*  | *String* | Path to the CSS theme, can be SASS or LESS |
| `css.themes[].csslint` | *true*  | *Boolean* | If theme need to be tested |
| `css.themes[].file` | *theme-name.min.css*  | *String* | The name of the single theme built |
| `css.themes[].fonts` | *path/\*\*/\*.\**  | *String* | Fonts path related to theme |
| `css.themes[].images` | *path/\*\*/\*.\**  | *String* | Images path related to theme |
| `css.themes[].merge` | *true*  | *Boolean* | If this theme should be in the final merged CSS file |
| `css.themes[].name`  | *theme-name*  | *String* | The name will be listed in the build logs, based on `config.verbose` |
| `css.themes[].path` | *path/to/css/* | *String* | If this theme should be built in a specific folder |
| `css.themes[].stylestats` | *true* | *Boolean* | If this theme is passed to stylestats report |
| `css.vendors`        | *mixed*              | *Object*  | It contains CSS vendors options |
| `css.vendors.file`   | *vendors.min.css*    | *String*  | The name of the merged and minified vendors CSS |
| `css.vendors.merge`  | *true*               | *Boolean* | If vendors will be merged into the final CSS file |
| `css.vendors.files`  | *-vendors/file.css*  | *Array*   | Files listed for the merged CSS vendors build |

| `css.watch` | *path/\*\*/\*.js*    | *String*  | Files watched from the main task watcher |

#### JavaScript

| Parameter            | Example value        | Type      | Description                     |
| -------------------- | -------------------- | --------- | ------------------------------- |
| `js`                 | *mixed*              | *Object*  | It contains JavaScript options  |
| `js.file`            | *dustman.min.js*     | *String*  | The name of the merged and minified JavaScript |
| `js.watch`           | *path/\*\*/\*.js*    | *String*  | Files watched from the main task watcher |
| `js.files`           | *-path/file.js*      | *Array*   | Files listed for the JavaScript build, it can also be a conatiner path like ´-path/app/*´ |
| `js.vendors`        | *mixed*              | *Object*  | It contains CSS vendors options |
| `js.vendors.file`   | *vendors.min.js*     | *String*  | The name of the merged and minified vendors JS |
| `js.vendors.merge`  | *true*               | *Boolean* | If vendors will be merged into the final JS file |
| `js.vendors.files`  | *-vendors/file.css*  | *Array*   | Files listed for the merged JS vendors build |

#### Paths

| Parameter      | Example value   | Type     | Description                                                                            |
| -------------- | --------------- | -------- | -------------------------------------------------------------------------------------- |
| `paths`        | *mixed*        | *Object* | It contains build path targets                                                         |
| `paths.server` | *path/to/html/* | *String* | Path where the **Browser sync** local server will point and **Twig** will be generated |
| `paths.css` | *path/to/html/css/* | *String* | Where **CSS files** will be moved from source targets to the production folders |
| `paths.images` | *path/to/html/images/* | *String* | Where **images files** will be moved from source targets to the production folders |
| `paths.fonts` | *path/to/html/fonts/* | *String* | Where **fonts files** will be moved from source targets to the production folders |
| `paths.js` | *path/to/html/js/* | *String* | Where **js files** will be moved from source targets to the production folders |

#### Shell

Shell node module doesn't seems to support every command

| Parameter      | Example value       | Type     | Description              |
| -------------- | ------------------- | -------- | -----------------------  |
| `shell`        | *mixed*             | *Object* | It contains shell tasks options |
| `shell.before` | *-bash command*     | *Array*  | Bash commands will be executed in series **before** the build tasks |
| `shell.after`  | *-bash command*     | *Array*  | Bash commands will be executed in series **after** the build tasks |

#### Tasks

| Parameter            | Example value | Type      | Description                     |
| -------------------- | ------------- | --------- | ------------------------------- |
| `tasks` | *-css*        | *Array*  | It contains the sub tasks pipeline build sequence |

You can add `css`, `js` and `html`

#### HTML

| Parameter      | Example value       | Type     | Description              |
| -------------- | ------------------- | -------- | -----------------------  |
| `html`         | *mixed*             | *Object* | It contains twig options |
| `html.engine`  | *twig*              | *String* | The engine used, [Twig][twig] or HTML for now (html by default) |
| `html.watch`   | *path/\*\*/\*.twig* | *String* | Files watched from the main task watcher |
| `html.files`   | *-path/file.twig*   | *Array*  | Files listed for the HTML build |

#### Vendors

| Parameter            | Example value        | Type      | Description                     |
| -------------------- | -------------------- | --------- | ------------------------------- |
| `vendors`            | *mixed*              | *Object*  | It contains vendors options     |
| `vendors.fonts`      | *-vendors/font.ttf*  | *Array*   | Files listed to be moved on fonts production folder |
| `vendors.images`     | *-vendors/image.svg* | *Array*   | Files listed to be moved on images production folder |

---

# Previous release details

##### Release 1.3.X details

| Type    | Description  |
|---------|--------------|
| feature | Added polling option to Gulp watcher to prevent missing Vagrant NFS filesync with local system and VM |


##### Release 1.2.X details

| Type            | Description  |
|-----------------|--------------|
| fix             | Optimized files verification to be of their relative task modules |
| coding standard | Remove unused comments |
| fix             | Fix shell tasks not started properly |
| feature         | Now it's possible to verify files built to ensure everything work as expected |

##### Release 1.1.X details

| Type         | Description  |
|--------------|--------------|
| optimization | If JS or CSS vendor files are removed they will be built again |
| fix          | Fix wrong name notice log for fonts vendors |
| fix          | Fix vendors assets always skipping from build |
| fix          | Fix wrong default JavaScript path for vendors |
| fix          | Decommented missing minimized JavaScript files |
| optimization | Task logs are more consistent |
| optimization | Critical build speed improvement, with vendors cached after first build |
| change       | Change how CSS and JavaScript vendors are built |

---

Dustman is coded with love by [vitto][vitto] @ [ideato][ideato]

[node]: https://www.npmjs.com/package/dustman
[vitto]: https://github.com/vitto
[ideato]: http://www.ideato.it
[sass]: http://sass-lang.com/
[less]: http://lesscss.org/
[yaml]: http://yaml.org/
[csslint]: https://github.com/CSSLint/csslint
[stylestats]: https://github.com/t32k/stylestats
[autoprefixer]: https://github.com/postcss/autoprefixer
[twig]: http://twig.sensiolabs.org/
[browsersync]: https://www.browsersync.io/
[faker]: https://github.com/marak/Faker.js/
[gulp]: http://gulpjs.com/
[htmlprettify]: https://www.npmjs.com/package/gulp-html-prettify
