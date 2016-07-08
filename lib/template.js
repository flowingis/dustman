'use strict';

/*
  D U S T M A N
  {{ version }}

  A Gulp 4 automation boilerplate
  by https://github.com/vitto
*/

var gulp = require('gulp');

{{ body }}

message.intro();
config.load('{{ nodeVersion }}');
message.verbose('Version', '{{ version }}');
message.verbose('Config loaded', config.file());
tasks.init();
