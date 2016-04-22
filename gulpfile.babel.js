import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

/*browserify的配置文件*/
const babelify = require('babelify');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

//browserify配置
const customOpts = {
    entries: ['src/app.js'],
    debug: true
};
const opts = Object.assign({}, watchify.args, customOpts);
gulp.task('watchify', () => {
    var bundler = watchify(browserify(opts));

    function rebundle() {
        return bundler.bundle()
            .pipe(source('app.js'))
            .pipe($.plumber())
            .pipe(buffer())
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.babel())
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest('dist'));
    }
    bundler.transform(babelify)
        .on('update', rebundle);
    return rebundle();
});

//检测代码的质量
function lint(files, options) {
    return () => {
        return gulp.src(files)
            .pipe($.eslint(options))
            .pipe($.eslint.format())
            .pipe($.eslint.failAfterError());
    };
}
gulp.task('lint', lint('dist/*.js'));


gulp.task('default', ['watchify']);