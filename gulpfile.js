const gulp = require('gulp');
const babel = require('gulp-babel');
const changed = require('gulp-changed');

const SRC = 'src/**';
const DEST = 'build';

gulp.task('default', ['js']);

gulp.task('js', () => {
  return gulp.src(SRC)
    .pipe(changed(DEST))
    .pipe(babel({
      presets: ['es2015', 'react'],
      plugins: ['transform-object-rest-spread']
    }))
    .pipe(gulp.dest(DEST));
});

gulp.task('watch', () => {
  gulp.start('js');
  gulp.watch(SRC, ['js']);
});