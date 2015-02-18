var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('compile', function() {
    gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest('dist'))
});