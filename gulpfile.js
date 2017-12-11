var gulp = require('gulp');
var server = require('gulp-express');
var nodemon = require('gulp-nodemon');

//"start": "node ./bin/www"
gulp.task('start', function () {
  nodemon({
    script: 'bin/www', 
    ext: 'js html'
  })
});
