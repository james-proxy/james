const gulp = require('gulp');
const es = require('event-stream');
const babel = require('gulp-babel');
const del = require('del');
const rename = require('gulp-rename');
const newer = require('gulp-newer');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const useref = require('gulp-useref');
const electronConnect = require('electron-connect').server;
const gulpif = require('gulp-if');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const jeditor = require('gulp-json-editor');
const version = require('./package.json').version;

gulp.task('default', ['js', 'css', 'resources']);
gulp.task('dist-prep', ['dist-resources', 'browserify']);

gulp.task('clean', () => {
  return del.sync(['build', 'package', 'binaries']);
});

gulp.task('js', (done) => {
  return gulp.src('src/**')
    .pipe(newer('build'))
    .pipe(babel({
      presets: ['es2015', 'react'],
      plugins: ['transform-object-rest-spread']
    }))
    .on('error', done) // Handle error so 'watch' tasks don't stop mid-development, but still send errcode 1
    .pipe(gulp.dest('build'));
});

gulp.task('css', () => {
  return gulp.src('style/main.scss')
    .pipe(newer({dest: 'build/james.css', extra: ['style/**/*.scss']}))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('james.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

// There's two separate `resource-*` directories.
// `resource-runtime` contains actual files which will exist in the same
// directory as James at runtime, in production (e.g. the browser images).
// `resource-compile` has resources that we don't necessarily want taking space with James, because they're compiled
// in in a special way (e.g. icons), they're not used in the build (e.g. the screenshot) or aren't just directly
// copied, and are modified along the way
gulp.task('resources', () => {
  const dest = 'build';

  return es.merge([
    gulp.src('node_modules/font-awesome/fonts/**').pipe(gulp.dest(`${dest}/fonts`)),
    gulp.src('resource-runtime/**')
      .pipe(newer(dest))
      .pipe(gulp.dest(dest)),
    gulp.src('resource-compile/package.json')
      .pipe(jeditor({ version }))
      .pipe(gulp.dest(dest))
  ]);
});

gulp.task('dist-resources', ['css'], () => {
  const dest = 'package';

  return es.merge([
    gulp.src('node_modules/font-awesome/fonts/**').pipe(gulp.dest(`${dest}/fonts`)),
    gulp.src('build/james.css').pipe(gulp.dest(dest)),
    gulp.src('resource-runtime/**')
      .pipe(gulpif('*.html', useref()))
      .pipe(gulp.dest(dest)),
    gulp.src('resource-compile/package.json')
      .pipe(jeditor({ version }))
      .pipe(gulp.dest(dest))
  ]);
});

gulp.task('browserify', ['js'], () => {
  process.env.NODE_ENV = 'production';
  const opts = {
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
  };

  browserify('build/index.js', opts)
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('./package'));

  browserify('build/electron-app.js', opts)
    .bundle()
    .pipe(source('electron-app.js'))
    .pipe(gulp.dest('./package'));
});

gulp.task('watch', ['default'], () => {
  gulp.watch('src/**', ['js']);
  gulp.watch('style/**', ['css']);
  gulp.watch('resource-runtime/**', ['resources']);
});

gulp.task('livereload', ['default'], () => {
  const server = electronConnect.create({path: './build'});
  server.start();
  const restart = () => server.restart();

  gulp.watch('src/**', ['js', restart]);
  gulp.watch('style/**', ['css', restart]);
  gulp.watch('resource-runtime/**', ['resources', restart]);
});
