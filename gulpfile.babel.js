import gulp from 'gulp';
import sass from 'gulp-sass';
import sasslint from 'gulp-sass-lint';
import postcss from 'gulp-postcss';
import imagemin from 'gulp-imagemin';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import source from 'vinyl-source-stream';
import browserify from 'browserify';

const sourcePath = 'src';
const destPath = 'public';
const tempPath = 'temp';
const sassGlob = `${sourcePath}/scss/**/*.scss`
const cssSourcePath = `${sourcePath}/scss/main.scss`;
const cssTempPath = `${tempPath}/css`;
const cssDestPath = `${destPath}/css`;
const jsSourcePath = `${sourcePath}/js/main.js`;
const jsDestPath = `${destPath}/js`;
const jsDestFilename = 'join-it.js';

/** todo - gulp imagemin **/

gulp.task('sasslint', function () {
  return gulp.src(sassGlob)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

gulp.task('sass', ['sassLint'], function () {
    return gulp.src(cssSourcePath)
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest(cssTempPath));
});

gulp.task('css', ['sass'], function () {
    const processors = [
        autoprefixer({
            browsers: ['last 2 versions', '> 1%', 'IE 8', 'IE 9']
        }),
        cssnano()
    ];
    return gulp.src(`${cssTempPath}/**/*.css`)
        .pipe(postcss(processors))
        .pipe(gulp.dest(cssDestPath));
});

gulp.task('browserify', function () {
    return browserify(jsSourcePath)
        .bundle()
        .pipe(source(jsDestFilename)) // Output file
        .pipe(gulp.dest(jsDestPath));
});

gulp.task('default', ['css', 'browserify']);
