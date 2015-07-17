var gulp = require('gulp');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var shell = require('gulp-shell');
var cssGlobbing = require('gulp-css-globbing');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var _ = require('./bower_components/underscore/underscore.js');


// App Build Tasks

gulp.task('build:vendor', function(){
    return gulp.src(mainBowerFiles())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist'));
});


gulp.task('build:app', function(){
    var b = setupAppBundle();
    bundleApp(b);
});

gulp.task('build:sass', function(){
    return gulp.src(['./lib/scss/styles.scss'])
        .pipe(cssGlobbing({ extensions: ['.scss'] }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            precision: 10
        }))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./sourcemaps'))
        .pipe(gulp.dest('./dist'));
});

// Build Helpers

function setupAppBundle(browserifyArgs) {
    var b = browserify(_.extend({
        debug: true,
    }, browserifyArgs));
    b.add('./lib/main.js');

    return b;
}

function bundleApp(b, transforms) {
    b = b.bundle().pipe(source('app.js'))
    _.each(transforms, function(transform){
        b = b.pipe(transform());
    });
    b.pipe(gulp.dest('./dist'));
}

gulp.task('watch:app', function(){
    var b = setupAppBundle(watchify.args);
    var w = watchify(b);

    w.on('update', function(){
        bundleApp(w);
    });

    bundleApp(w);
});


gulp.task('build', ['build:vendor','build:app', 'build:sass']);
gulp.task('watch', ['watch:app']);