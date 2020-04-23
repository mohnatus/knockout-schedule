const { src, dest, series, parallel, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const browserify = require('gulp-browserify');
browserSync = require('browser-sync').create();

function bs() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
};

function clean(cb) {
	cb();
}

function jsBuild() {
	return (
		src('src/app.js')
			.pipe(babel())
			//.pipe(uglify())
			.pipe(browserify({}))
			.pipe(dest('dist/'))
	);
}

function lessBuild() {
	return src('src/app.less').pipe(less()).pipe(dest('dist/'));
}

exports.default = series(clean, parallel(jsBuild, lessBuild));

exports.watch = () => {
  bs();
	watch('src/**/*.js', jsBuild);
	watch('src/**/*.less', lessBuild);
};
