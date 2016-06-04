dustman
---

[![Version](http://img.shields.io/:version-0.0.24-e07c4b.svg)][node]
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

##### Release details

- Faker integration in Twig templates to get fake data on views
- Travis integration
- Fix callback tasks to get correct async tasks pipelines

---

## Build tasks

All tasks can run locally with `./node_modules/.bin/gulp taskname` in the tasks table will be used `gulp taskname` to be easy to read.

Note all task has `--silent` or `-S` flag to avoid Gulp logs.

### Tasks dependency trees

```bash
──┬ css:build
  └─┬─┬ css:theme:theme-id:build
    ├─┬ css:theme:theme-two:build
    ├─┬ vendors:build
    └── css:merge
─── css:merge
──┬ css:theme:theme-id:build
  └─┬── css:theme:theme-id:css
    ├── css:theme:theme-id:prefixAutoprefixer
    ├── css:theme:theme-id:testCsslint
    ├── css:theme:theme-id:reportStylestats
    ├── css:theme:theme-id:images
    └── css:theme:theme-id:fonts
─── css:theme:theme-id:css
─── css:theme:theme-id:fonts
─── css:theme:theme-id:images
─── css:theme:theme-id:prefixAutoprefixer
─── css:theme:theme-id:testCsslint
─── css:theme:theme-id:reportStylestats
──┬ default
  └─┬─┬ css:theme:theme-id:build
    ├─┬ vendors:build
    ├── css:merge
    ├── js:build
    └─┬ twig:build
──┬ http
  └─┬─┬ css:build
    └── watch:http
─── js:build
──┬ twig:build
  └──── twig:html
─── twig:html
──┬ vendors:build
  └─┬── vendors:css
    ├── vendors:images
    └── vendors:fonts
─── vendors:css
─── vendors:fonts
─── vendors:images
──┬ watch
  └─┬─┬ css:build
    ├─┬ twig:build
    └── js:build
─── watch:http
─── watch:js
```

---

## Config example

```yaml

---

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

config:
  autoprefixer:
    browsers:
      - last 3 versions
  csslint: csslintrc.json
  stylestats: .stylestatsrc
  prettify:
    indent_char: ' '
    indent_size: 2

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


[node]: https://www.npmjs.com/package/dustman
