#!/bin/bash

YAML=./dustman.yml
GULP=./gulpfile.js

if [ -f "$YAML" && -f "$GULP" ];
then
  echo "Files $YAML and $GULP are allready in the project folder\nTo use dustman remove these files and run 'cp ./node_modules/dustman/gulpfile.js gulpfile.js && cp ./node_modules/dustman/dustman.yml dustman.yml'"
else
  cp ./node_modules/dustman/gulpfile.js gulpfile.js
  cp ./node_modules/dustman/dustman.yml dustman.yml
fi


# YAML=./dustman.yml GULP=./gulpfile.js if [ -f "$YAML" && -f "$GULP" ]; then echo "Files $YAML and $GULP are allready in the project folder\nTo use dustman remove these files and run 'cp ./node_modules/dustman/gulpfile.js gulpfile.js && cp ./node_modules/dustman/dustman.yml dustman.yml'" else cp ./node_modules/dustman/gulpfile.js gulpfile.js && cp ./node_modules/dustman/dustman.yml dustman.yml  fi
