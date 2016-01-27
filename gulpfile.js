const gulp = require('gulp');
const es = require('event-stream');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const changed = require('gulp-changed');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('default', ['js', 'css', 'resources']);

gulp.task('js', () => {
  return gulp.src('src/**')
    .pipe(changed('build'))
    .pipe(babel({
      presets: ['es2015', 'react'],
      plugins: ['transform-object-rest-spread']
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('css', () => {
  return gulp.src('style/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename('james.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

gulp.task('resources', () => {
  return es.merge([
    gulp.src('node_modules/font-awesome/fonts/**').pipe(gulp.dest('build/fonts')),
    gulp.src('resource/**')
      .pipe(changed('build'))
      .pipe(gulp.dest('build'))
  ]);
});

gulp.task('watch', () => {
  gulp.start('default');
  gulp.watch('src/**', ['js']);
  gulp.watch('style/**', ['css']);
  gulp.watch('resource/**', ['resources']);
});