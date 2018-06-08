/*eslint-env node */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('images', function() {

  return gulp.src('src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));

});

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('lint', () => {
  return gulp.src(['src/js/**/*.js','!node_modules/**'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dest', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', function() {

  return gulp.src('src/sass/**/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());

});

gulp.task('copy-html', function() {
  return gulp.src('*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-images', function() {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('default', function() {
  gulp.watch('src/sass/**/*.scss', gulp.series('styles'));
  gulp.watch('src/js/**/*.js', gulp.parallel('lint', 'scripts'));
  gulp.watch('*.html', gulp.series('copy-html'));
  gulp.watch('src/js/**/*.js', gulp.series('lint'));
  gulp.watch('src/*.html').on('change', browserSync.reload);

  browserSync.init({
    server: "./dist"
  });

});

var serve = gulp.series(
  'clean',
  'images',
  'copy-html',
  gulp.parallel('styles', 'lint'),
  'scripts',
  'default'
);
gulp.task('serve', serve);

var build = gulp.series(
  'clean',
  'images',
  'copy-html',
  gulp.parallel('lint', 'scripts-dest'),
  'styles'
);
gulp.task('build', build);