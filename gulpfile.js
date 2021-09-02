const { src, dest } = require('gulp');
var concat = require('gulp-concat');

exports.default = function () {
  return src('dist/*.js').pipe(concat('main.js')).pipe(dest('dist/'));
};
