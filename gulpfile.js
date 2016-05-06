const gulp = require('gulp');
const es = require('event-stream');
const babel = require('gulp-babel');
const del = require('del');
const rename = require('gulp-rename');
const changed = require('gulp-changed');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const electron = require('electron-packager');
const useref = require('gulp-useref');
const electronConnect = require('electron-connect').server.create();
const gulpif = require('gulp-if');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

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
    .on('error', done) // Handle error so 'watch' tasks don't stop mid-development, but still send errcode 1
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
    gulp.src('package.json').pipe(gulp.dest('package')),
    gulp.src('resource/**')
      .pipe(gulpif('*.html', useref()))
      .pipe(gulp.dest('package'))
  ]);
});

function gulpBrowserify(entry) {
  process.env.NODE_ENV = 'production';
  return browserify(entry, {
    builtins: false,
    commondir: false,
    browserField: false,
    insertGlobals: false,
    insertGlobalVars: {
      process: undefined,
      global: undefined,
      'Buffer.isBuffer': undefined,
      Buffer: undefined,
      __dirname: undefined,
      __filename: undefined
    },
    ignoreMissing: true,
    transform: [
      'envify'
    ]
  }).bundle();
}

gulp.task('package-render', ['default'], () => {
  gulpBrowserify('build/index.js')
    .pipe(source('index.js'))
    .pipe(gulp.dest('./package'));
});

gulp.task('package-main', ['default'], () => {
  gulpBrowserify('build/electron-app.js')
    .pipe(source('electron-app.js'))
    .pipe(gulp.dest('./package'));
});

gulp.task('package', ['package-resources', 'package-render', 'package-main'], (done) => {
  const appVersion = require('./package.json').version;
  const electronVersion = require('electron-prebuilt/package.json').version;
  console.log(`Packaging James v${appVersion}...`);

  electron({
    all: true,
    dir: 'package',
    platform: 'all',
    name: 'James',
    overwrite: true,
    icon: 'resource/icon.icns',
    'app-version': appVersion,
    version: electronVersion,
    out: 'binaries'
  }, (err) => done(err));
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
