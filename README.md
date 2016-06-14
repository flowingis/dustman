d u s t m a n
---

[![Version](http://img.shields.io/:version-0.6.32-e07c4b.svg)][node]
[![TravisCI](https://travis-ci.org/vitto/dustman.svg?branch=master)](https://travis-ci.org/vitto/dustman/builds)
[![Built with nodejs 4.2.2](http://img.shields.io/:nodejs-4.1.1-80BD01.svg)](https://nodejs.org/en/)
[![NPM](http://img.shields.io/:NPM-package-C12127.svg)][node]
[![MIT licence](http://img.shields.io/:license-MIT-00AFFF.svg)](https://github.com/vitto/dustman/blob/master/LICENSE.md)

**Gulp + YAML config** based front-end automation boilerplate

---

Dustman is basically a set of Gulp tasks ready to be used as a build system which helps you to:

- **Build SASS** with multiple themes, CSS vendors and assets already optimized for production environments, you can perform dynamic tasks with **selective configuration** based on *CSSlint tests*, *StyleStats reports* and *Autoprefixer* tasks for a better automated browser support.
- **Build JavaScript** apps with dependencies in sequence you need, everything minimized in one file.
- **Build Twig templates** to HTML pages with *browser sync* ready to be tested.
- **Watch files** automation tasks listeners to update your build automatically.

---

##### Gulp 4 alpha

At the moment Dustman is based on **Gulp 4 which is in alpha release status** so use it on your own risk! I didn't noticed any problems, but I didn't tested it in many environments.

##### Why Gulp 4?

- Because it has a **superior task concatenation** system compared to the previous major release.
- Because the watcher and the build system are **dramatically faster**.

---

##### Release details

- Add optional `merge` attribute to config for CSS themes and CSS vendors
- Autoprefixer now creates a file `file.autoprefixer.css` instead to move it on a `autoprefixer` folder
- Fix how merge CSS themes skipped if vendor CSS files are not present
- Add custom `path` override for CSS themes
- Add LESS support automatically detected by file extension

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

Note: Tasks with `--silent` or `-S` flag will avoid Gulp task logs.

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

In the `dustman.yml` config, you can use one or all of these tasks `css:build`, `js:build` or `html:build` to make the build as you need.

```yaml
tasks:
  - css:build
  - js:build
  - html:build
```

---

### Tasks dependency trees

```bash
──┬ default
  └─┬─┬ css:build
    ├── js:build
    └─┬ html:build
──┬ http
  └─┬─┬ css:build
    ├── js:build
    ├─┬ html:build
    └── watch:http
──┬ watch
  └─┬─┬ css:build
    ├── js:build
    └─┬ html:build
```

---

# Config example

```yaml
---

tasks:
  - css:build
  - js:build
  - html:build

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

css:
  file: themes-with-vendors.min.css
  watch: my/sass/files/**/*.scss
  verbose: 3
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

#### Tasks

| Parameter            | Example value        | Type      | Description                     |
| -------------------- | -------------------- | --------- | ------------------------------- |
| `tasks` | *-css:build* | *Array*  | It contains the sub tasks pipeline build sequence |

You can add `css:build`, `js:build` and `html:build`

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
