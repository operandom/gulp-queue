'use strict';

var gulp  = require('gulp'),
    fork  = require('child_process').fork,
    mocha
;

test();

gulp.task('default', function() {
    gulp.watch(['index.js', 'test/index.js'], test);
});

function test() {
    mocha = fork('node_modules/mocha/bin/mocha');
}
