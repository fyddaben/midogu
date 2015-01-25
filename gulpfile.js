var gulp = require('gulp');

var coffee = require('gulp-coffee');

var uglify = require('gulp-uglify');

var minicss = require('gulp-minify-css');

var rimraf = require('rimraf');

var less = require('gulp-less');

var paths = {
    coffee: ['./*/coffee/**/*.coffee', '!./*/coffee/_*/*.coffee'],
    less: ['./*/less/**/*.less', '!./*/less/_*/*.less'],
    jsmin: ['./*/js/**/*.js', '!./*/js/_*/*.js']
};
gulp.task('coffee', function() {

    var l = coffee();
    l.on('error', function(e) {
        console.log(e)
        l.end()
    });
    gulp.src(paths.coffee).pipe(coffee({
        bare: true
    })).pipe(uglify()).pipe(gulp.dest('./*/jsmin'));
});
gulp.task('less', function() {
    var l = less();
    l.on('error', function(e) {
        console.log(e)
        l.end()
    });
    
    gulp.src(paths.less)
        .pipe(less())
        .pipe(minicss())
        .pipe(gulp.dest('./*/css'));
});
gulp.task('jsmin', function() {
    var l = uglify();
    l.on('error', function(e) {
        console.log(e)
        l.end()
    });
    gulp.src(paths.jsmin)
        .pipe(uglify())
        .pipe(gulp.dest('./*/jsmin'));
});
// Rerun the task when a file changes
gulp.task('watch', function() {

    gulp.watch(paths.coffee, ['coffee']);
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.jsmin, ['jsmin']);
});
gulp.task('default', ['watch', 'coffee', 'less', 'jsmin']);


