var gulp = require('gulp');

var env = process.env.NODE_ENV;

var HtmlClean = require('gulp-htmlclean');

var Less = require('gulp-less');

var Postcss = require('gulp-postcss');

var Autoprefixer = require('autoprefixer');

var CleanCss = require('gulp-clean-css');

var StripDebug = require('gulp-strip-debug');

var Uglify = require('gulp-uglify');

var Imagemin = require('gulp-imagemin');

var Connect = require('gulp-connect');

var fold = {
    src: './src',
    dist: './dist'
}

gulp.task('html', function () {
    var page = gulp.src(fold.src + '/html/*')
        .pipe(Connect.reload());
    env == 'development' ? '' : page.pipe(HtmlClean());
    page.pipe(gulp.dest(fold.dist + '/html/'));
});

gulp.task('css', function () {1
    var page = gulp.src(fold.src + '/css/*')
        .pipe(Less())
        .pipe(Postcss([Autoprefixer]))
        .pipe(Connect.reload());
    env == 'development' ? '' : page.pipe(CleanCss());
    page.pipe(gulp.dest(fold.dist + '/css/'))
});

gulp.task('js', function () {
    var page = gulp.src(fold.src + '/js/*')
        .pipe(Connect.reload());
    if (env == 'production') {
        page.pipe(StripDebug)
            .pipe(Uglify);
    }
    page.pipe(gulp.dest(fold.dist + '/js/'));
});

gulp.task('image', function () {
    var page = gulp.src(fold.src + '/image/*')
        .pipe(Connect.reload())
        .pipe(gulp.dest(fold.dist + '/image/'))
});

gulp.task('server', function () {
    Connect.server({
        port: 8899,
        livereload: true
    })
});

gulp.task('watch', function () {
    gulp.watch(fold.src + '/html/*', ['html']);
    gulp.watch(fold.src + '/css/*', ['css']);
    gulp.watch(fold.src + '/js/*', ['js']);
    gulp.watch(fold.src + '/image/*', ['image']);
})

gulp.task('mock', function () {
    gulp.src(fold.src + '/mock/*')
        .pipe(gulp.dest(fold.dist + '/mock/'))
})

gulp.task('default', ['html', 'css', 'js', 'image', 'server', 'watch', 'mock'])