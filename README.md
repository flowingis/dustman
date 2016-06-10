d u s t m a n
---

[![Version](http://img.shields.io/:version-0.2.28-e07c4b.svg)][node]
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

- Sub tasks can now be selected directly from YAML config
- Performance optimizations for vendors tasks on watcher

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

Dustman is coded with love by [vitto][vitto] @ [ideato][ideato]

[node]: https://www.npmjs.com/package/dustman
[vitto]: https://github.com/vitto
[ideato]: http://www.ideato.it
