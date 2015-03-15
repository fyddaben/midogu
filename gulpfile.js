var gulp = require('gulp');

var coffee = require('gulp-coffee');

var uglify = require('gulp-uglify');

var minicss = require('gulp-minify-css');

//var rimraf = require('rimraf');

var less = require('gulp-less');

var sass = require('gulp-sass');

var paths = {
    coffee: ['./daben/coffee/**/*.coffee', '!./daben/coffee/_*/*.coffee'],
    less: ['./daben/less/**/*.less', '!./daben/less/_*/*.less'],
    sass: ['./daben/sass/**/*.scss', '!./daben/sass/_*/*.scss'],
    jsmin: ['./daben/js/**/*.js', '!./daben/js/_*/*.js']
};
gulp.task('coffee', function() {

    var l = coffee();
    l.on('error', function(e) {
        console.log(e)
        l.end()
    });
    gulp.src(paths.coffee).pipe(coffee({
        bare: true
    })).pipe(uglify()).pipe(gulp.dest('./daben/jsmin'));
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
        .pipe(gulp.dest('./daben/css'));
});
gulp.task('sass', function() {
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(minicss())
        .pipe(gulp.dest('./daben/css'));
});
gulp.task('jsmin', function() {
    var l = uglify();
    l.on('error', function(e) {
        console.log(e)
        l.end()
    });
    gulp.src(paths.jsmin)
        .pipe(uglify())
        .pipe(gulp.dest('./daben/jsmin'));
});
// Rerun the task when a file changes
gulp.task('watch', function() {

    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.coffee, ['coffee']);
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.jsmin, ['jsmin']);
});
gulp.task('default', ['watch', 'coffee', 'sass', 'less', 'jsmin']);


