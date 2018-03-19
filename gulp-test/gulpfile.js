var gulp = require('gulp');
var browserSync = require('browser-sync');        // synchronizacja przegladarek
var sass = require('gulp-sass');                  // SCSS na CSS
var sourcemaps = require('gulp-sourcemaps');      // mapa pliku CSS na SCSS
var autoprefixer = require('gulp-autoprefixer');  // dopasowanie prefiksow CSS pod wiele przeglądarek
var cleanCSS = require('gulp-clean-css');         // minimalizowanie plikow CSS
var uglify = require('gulp-uglify');              // minimalizowanie plikow JS
var concat = require('gulp-concat');              // laczenie wielu plikow CSS i JS w jeden
var imagemin = require('gulp-imagemin');          // zmniejszanie rozmiaru zdjecia
var changed = require('gulp-changed');            // zmniejszanie tylko zmodyfikowanych plikow - uprzednio zmiejszone nie sa nadpisywane
var htmlReplace = require('gulp-html-replace');   // zmiana blokow kodu html wedlug klucza
var htmlMin = require('gulp-htmlmin');            // optymalizacja pliku HTML
var del = require('del');                         // usunięcie sterego buildu
var sequence = require('run-sequence');           // zmiana trybu pracy gulpa z asynchronicznego na sekwencyjny

var config = {
  dist: 'dist/',
  src: 'src.',
  cssin: 'src/css/**/*.css',
  jsin: 'src/js/**/*.js',
  imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
  htmlin: 'src/*html',
  scssin: 'src/scss/**/*.scss',
  cssout: 'dist/css/',
  jsout: 'dist/js/',
  imgout: 'dist/img/',
  htmlout: 'dist/',
  scssout: 'src/css/',
  cssoutname: 'style.css',
  jsoutname: 'script.js',
  cssoutreplace: 'css/style.css',
  jsoutreplace: 'js/script.js'
};

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('serve', ['sass'], function() {

  browserSync({
    server: config.src
  });

  gulp.watch([config.htmlin, config.jsin], ['reload']);
  gulp.watch(config.scssin, ['sass']);
});

gulp.task('sass', function() {
  return gulp.src(config.scssin)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scssout))
    .pipe(browserSync.stream());
});

gulp.task('css', function () {
  return gulp.src(config.cssin)
    .pipe(concat(config.cssoutname))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.cssout));
});

gulp.task('js', function() {
  return gulp.src(config.jsin)
    .pipe(concat(config.jsoutname))
    .pipe(uglify())
    .pipe(gulp.dest(config.jsout));
});

gulp.task('img', function () {
  return gulp.src(config.imgin)
    .pipe(changed(config.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout));
});

gulp.task('html', function () {
  return gulp.src(config.htmlin)
  .pipe(htmlReplace({
    'css': config.cssoutreplace,
    'js': config.jsoutreplace
  }))
  .pipe(htmlMin({
    sortAttributes: true,
    sortClassName: true,
    collapseWhitespace: true
  }))
  .pipe(gulp.dest(config.dist))
});

gulp.task('clean', function () {
  return del([config.dist]);
});

gulp.task('build', function () {
  sequence('clean', ['html', 'js', 'css', 'img']);
});

gulp.task('default', ['serve']);
