const gulp = require('gulp');
const es = require('event-stream');
const babel = require('gulp-babel');
const del = require('del');
const rename = require('gulp-rename');
const changed = require('gulp-changed');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const electron = require('electron-packager');
const useref = require('gulp-useref');
const electronConnect = require('electron-connect').server.create();
const gulpif = require('gulp-if');
const exec = require('child_process').exec;

gulp.task('default', ['js', 'css', 'resources']);

gulp.task('clean', () => {
  return del.sync(['build', 'package', 'binaries']);
});

gulp.task('js', (done) => {
  return gulp.src('src/**')
    .pipe(changed('build'))
    .pipe(babel({
      presets: ['es2015', 'react'],
      plugins: ['transform-object-rest-spread']
    }))
    .on('error', done)//Don't want watch tasks to stop when mid-development, but still want errcode 1 on `npm run build`
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

gulp.task('package-resources', ['default'], () => {
  return es.merge([
    gulp.src('node_modules/font-awesome/fonts/**').pipe(gulp.dest('package/fonts')),
    gulp.src('build/james.css').pipe(gulp.dest('package')),
    gulp.src('resource/**')
      .pipe(gulpif('*.html', useref()))
      .pipe(gulp.dest('package'))
  ]);
});

gulp.task('package-browserify', ['default'], (cb) => {
  exec('browserify --node -e build/index.js -o ./package/index.js -u remote -u child-killer', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  })
});

gulp.task('package', ['package-resources', 'package-browserify'], (done) => {
  electron({
    all: true,
    dir: 'package',
    platform: 'all',
    name: 'James',
    overwrite: true,
    icon: 'resource/icon.icns',
    version: '0.36.5',
    out: 'binaries'
  }, () => done())
});

gulp.task('lint', () => {
  return gulp.src(['src/**', 'test/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
});

gulp.task('clean', () => {
  del.sync(['build', 'package', 'binaries']);
});

gulp.task('watch', ['default'], () => {
  gulp.watch('src/**', ['js']);
  gulp.watch('style/**', ['css']);
  gulp.watch('resource/**', ['resources']);
});

gulp.task('livereload', ['default'], () => {
  electronConnect.start();
  const reload = () => electronConnect.reload();
  gulp.watch('src/**', ['js', reload]);
  gulp.watch('style/**', ['css', reload]);
  gulp.watch('resource/**', ['resources', reload]);
});
