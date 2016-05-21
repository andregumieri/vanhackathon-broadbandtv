/**
 * CONFIG
 */
var src = "./src";
var dst = "./dist";



/**
 * MODULES
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var source = require('vinyl-source-stream');



/**
 * TASKS
 */
/**
 * TASK: default
 * The default gulp runner
 */
gulp.task('default', ['sass', 'manifest', 'scripts', 'images'], function() {});

/**
 * TASK: sass
 * Interprets sass and compile as .css
 */
gulp.task('sass', function() {
	return gulp.src(src+'/static/css/*.scss')
		.pipe(sass())
		.pipe(gulp.dest(dst+'/static/css'))
});

/**
 * TASK: manifest
 * Copy the manifest file to the dist folder
 */
gulp.task('manifest', function() {
	return gulp.src(src+'/manifest.json')
		.pipe(gulp.dest(dst));
});

/**
 * TASK: images
 * Copy the manifest file to the dist folder
 */
gulp.task('images', function() {
	return gulp.src(src+'/static/images/**/*')
		.pipe(gulp.dest(dst+'/static/images'));
});

/**
 * TASK: scripts
 * Build browserify js into .js
 */
gulp.task('scripts', function() {
	var scriptsSrc = src + '/static/scripts';
	var files = fs.readdirSync(scriptsSrc);
	for(var x=0; x<files.length; x++) {
		if(path.extname(files[x])!='.js') continue;

		var innerSrc = scriptsSrc + '/' + files[x];
		var arrPath = innerSrc.split('/');

		browserify(innerSrc)
			.bundle()
			.pipe(source(arrPath[arrPath.length-1]))
			.pipe(gulp.dest(dst + '/static/scripts'))
	}

	return ;
});
