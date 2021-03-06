var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-spawn-mocha');
var del = require('del');
var babel = require("gulp-babel");
var argv = require('yargs').argv;
var mustache = require('gulp-mustache');
var cp = require('child_process');

const defaults = {
    serverHost: '0.0.0.0',
    serverPort: 8001,
    environment: 'local',
    username: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    jwtSecret: 'secret'
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

gulp.task('build-test', ['default'], function() {
    return gulp.src('test/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/test'));
});

gulp.task('test', ['build-test'], function() {
    return gulp.src('dist/test/**/*.js').pipe(mocha());
});

gulp.task('migrate', function() {
    cp.execSync('"./node_modules/.bin/sequelize"' + (process.platform == 'win32' ? '.cmd' : '') + ' db:migrate', {stdio: 'inherit'});
});

gulp.task('migrateDown', function() {
    cp.execSync('"./node_modules/.bin/sequelize"' + (process.platform == 'win32' ? '.cmd' : '') + ' db:migrate:undo', {stdio: 'inherit'});
});
