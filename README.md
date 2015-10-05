gulp-queue
==========

A gulp plugin to be sure to have the last modifications of your files when you watch them.


Installation
------------

```shell
npm install --save-dev gulp-queue
```

Usage
-----

```javascript
var gulp = require('gulp'),
    Queue = require('gulp-queue')(gulp),
    queue = new Queue(),
```

```javascript
gulp.watch(glob, queue('task01'));
gulp.watch(glob2, queue('task02'));
gulp.watch(glob3, queue(['task01', 'task02']));
```

Example
-------

```javascript
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    Queue = require('gulp-queue')(gulp),
    queue = new Queue(),

    styles = 'src/styles/*.scss',
    screenStyle = 'src/styles/screen.scss'
;

gulp.task('styles', function() {
    gulp
    .src(screenStyle)
    .pipe(plumber())
    .pipe(sass({
        includePaths: [
            'bower_components/bootstrap-sass/assets/stylesheets/'
        ]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    gulp.watch(styles, queue('styles'));
});

```


Development
-----------

### Installation
```shell
git clone https://github.com/operandom/gulp-queue.git
npm install
```

### Commands

 * watch: `npm start`
 * test: `npm test`
