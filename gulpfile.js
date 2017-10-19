var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-spawn-mocha');
var del = require('del');
var babel = require("gulp-babel");
var argv = require('yargs').argv;
var mustache = require('gulp-mustache');

const defaults = {
    serverHost: 'localhost',
    serverPort: 3000,
    environment: 'local',
    username: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432
};

gulp.task('clean', function(cb) {
    return del(['dist/**'], function(err) {
        cb(err);
    });
});

gulp.task('default', ['clean'], function (cb) {
    var mustacheConfig = {};
    for (var val in defaults) {
        mustacheConfig[val] = argv[val] || defaults[val];
    }

    return gulp.src('lib/**/*.js')
        .pipe(babel())
        .pipe(mustache(mustacheConfig))
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('serve', ['default'], function () {
    nodemon({
      script: './dist/lib/index.js'
    , watch: 'lib'
    , ext: 'js html json'
    , tasks: ['default']
    });
});

gulp.task('test', function() {
    return gulp.src(['./test/**/*.js']).pipe(mocha());
});