d u s t m a n
---

[![Version](http://img.shields.io/:version-1.0.0-e07c4b.svg)][node]
[![TravisCI](https://api.travis-ci.org/vitto/dustman.svg?branch=master)](https://travis-ci.org/vitto/dustman/builds)
[![Built with nodejs 4.2.2](http://img.shields.io/:nodejs-4.1.1-80BD01.svg)](https://nodejs.org/en/)
[![NPM](http://img.shields.io/:NPM-package-C12127.svg)][node]
[![MIT licence](http://img.shields.io/:license-MIT-00AFFF.svg)](https://github.com/vitto/dustman/blob/master/LICENSE.md)

---

##### Release details

- Big refactoring to make everything easier to maintain

---

**Gulp + YAML config** based front-end automation boilerplate

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

In the `dustman.yml` config, you can use one or all of these tasks `css`, `js` or `html` to make the build as you need.

```yaml
tasks:
  - css:build
  - js:build
  - html:build
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
  - css
  - js
  - html

config:
  autoprefixer:
    browsers:
      - last 3 versions
  csslint: csslintrc.json
  stylestats: .stylestatsrc
  prettify:
    indent_char: ' '
    indent_size: 2
  faker:
    locale: it
  twig:
    cache: false
  verbose: 3

css:
  file: themes-with-vendors.min.css
  watch: my/sass/files/**/*.scss
  themes:
    -
      name: theme-one
      file: theme-one.css
      compile: my/sass/files/theme-one/import.scss
      images: my/sass/files/themes/default/img/**/*.*
      fonts: my/sass/files/themes/default/img/**/*.*
      csslint: true
      stylestats: true
      autoprefixer: true
    -
      name: theme-two
      file: theme-two.css
      compile: my/sass/files/theme-two/import.scss
      csslint: false
      stylestats: false
      autoprefixer: false

js:
  file: app-with-vendors.min.js
  watch: my/js/files/**/*.js
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
    - my/js/files/*

shell:
  before:
    - echo before build task command 01
    - echo before build task command 02
  after:
    - echo after build task command

vendors:
  css:
    file: vendors.min.css
    files:
      - vendor/angular/angular-csp.css
      - vendor/angular-bootstrap/ui-bootstrap-csp.css
      - vendor/font-awesome/css/font-awesome.css
      - vendor/angular-chart.js/dist/angular-chart.css
  fonts:
    - vendor/font-awesome/fonts/fontawesome-webfont.eot
    - vendor/font-awesome/fonts/fontawesome-webfont.svg
    - vendor/font-awesome/fonts/fontawesome-webfont.ttf
    - vendor/font-awesome/fonts/fontawesome-webfont.woff
    - vendor/font-awesome/fonts/fontawesome-webfont.woff2
    - vendor/font-awesome/fonts/FontAwesome.otf
  images:
    - vendor/font-awesome/fonts/fontawesome-webfont.svg

twig:
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
| `config.verbose` | *3* | *Integer* | The verbose value, 0: no messages, 3: all message logs |

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
| `css.watch` | *path/\*\*/\*.js*    | *String*  | Files watched from the main task watcher |

#### JavaScript

| Parameter            | Example value        | Type      | Description                     |
| -------------------- | -------------------- | --------- | ------------------------------- |
| `js`                 | *mixed*              | *Object*  | It contains JavaScript options  |
| `js.file`            | *dustman.min.js*     | *String*  | The name of the merged and minified JavaScript |
| `js.watch`           | *path/\*\*/\*.js*    | *String*  | Files watched from the main task watcher |
| `js.files`           | *-path/file.js*      | *Array*   | Files listed for the JavaScript build, it can also be a conatiner path like ´-path/app/*´ |

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

#### Twig

| Parameter      | Example value       | Type     | Description              |
| -------------- | ------------------- | -------- | -----------------------  |
| `twig`         | *mixed*            | *Object* | It contains twig options |
| `twig.watch`   | *path/\*\*/\*.twig* | *String* | Files watched from the main task watcher |
| `twig.files`   | *-path/file.twig*  | *Array*  | Files listed for the HTML build |

#### Vendors

| Parameter            | Example value        | Type      | Description                     |
| -------------------- | -------------------- | --------- | ------------------------------- |
| `vendors`            | *mixed*              | *Object*  | It contains vendors options     |
| `vendors.css`        | *mixed*              | *Object*  | It contains CSS vendors options |
| `vendors.css.file`   | *vendors.min.css*    | *String*  | The name of the merged and minified vendors CSS |
| `vendors.css.merge`  | *true*               | *Boolean* | If vendors will be merged into the final CSS file |
| `vendors.css.files`  | *-vendors/file.css*  | *Array*   | Files listed for the merged CSS vendors build |
| `vendors.fonts`      | *-vendors/font.ttf*  | *Array*   | Files listed to be moved on fonts production folder |
| `vendors.images`     | *-vendors/image.svg* | *Array*   | Files listed to be moved on images production folder |


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
