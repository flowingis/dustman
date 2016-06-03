# dustman
**Gulp + YAML config** based front-end automation boilerplate

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

paths:
  server: my/build/
  css: my/build/css/
  images: my/build/img/
  fonts: my/build/fonts/
  js: my/build/js/


```
