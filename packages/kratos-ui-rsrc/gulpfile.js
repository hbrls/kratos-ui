const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const replace = require('gulp-replace');
const del = require('del');
const { REV, NAME, PROJECT_PATH, TARGET_DIR, SOURCE_DIR, DLL } = require('./rsrc.config.js');


gulp.task('_del', () => {
  return del([
    '../kratos-ui/src/app/public/rsrc/dist',
  ], { force: true });
});


gulp.task('_replace', () => {
  const assetsMap = JSON.parse(fs.readFileSync(path.resolve(PROJECT_PATH, 'webpack-assets.json')));

  const REG = new RegExp('([0-9a-z]*)-r3p1ac3ha5h\.(css|js)', 'ig');

  const VIEW_DIR = path.resolve(TARGET_DIR, '../../view');

  return gulp.src(path.resolve(VIEW_DIR, '**/*.html'))
    .pipe(replace(REG,
      function (match, p1, p2) {
        return assetsMap[p1][p2];
      },
      { skipBinary: false }))
    .pipe(gulp.dest(VIEW_DIR));
});
