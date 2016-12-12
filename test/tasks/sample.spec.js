'use strict';

var assert = require('assert');
var exec = require('child_process').exec;
var gulp = '$(which gulp) ';

describe('Test sample task', function() {
  describe('#sample()', function() {
    var stdout = '';

    beforeEach(function (done)
    {
      exec(gulp + 'sample', function (err, out)
      {
        stdout = out;

        done();
      });
    });

    it('should print "here i am" string when the task is launched', function() {
      assert(stdout.indexOf('here i am'));
    });
  });
});
