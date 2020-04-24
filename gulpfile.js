const { src, dest, series, parallel, watch } = require('gulp');
const babel = require('gulp-babel');
const less = require('gulp-less');
const browserify = require('gulp-browserify');
const terser = require('gulp-terser');
const gulpClean = require('gulp-clean');
browserSync = require('browser-sync').create();

function bs() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
};

function reload(cb) {
	browserSync.reload();
	cb();
}

function html() {
	return src('src/index.html')
		.pipe(dest('dist/'))
}

function images() {
	return src('src/img/*')
		.pipe(dest('dist/img/'))
}

function clean() {
	return src('dist/*')
		.pipe(gulpClean({ read: false }));
}

function vendors() {
	return (
		src('src/vendors/*')
			.pipe(dest('dist/vendors/'))
	)
}

function jsBuild() {
	return (
		src('src/app.js')
			.pipe(babel())
			.pipe(browserify({}))
			.pipe(terser())
			.pipe(dest('dist/'))
	);
}

function lessBuild() {
	return src('src/app.less').pipe(less()).pipe(dest('dist/'));
}

exports.default = series(clean, parallel(html, vendors, images, jsBuild, lessBuild));

exports.watch = () => {
	bs();
	html();
	vendors();
	images();
	jsBuild();
	lessBuild();
	watch('src/index.html', html);
	watch('src/img/*', images);
	watch('src/**/*.js', jsBuild);
	watch('src/**/*.less', lessBuild);
	watch('dist/*', reload)
};
