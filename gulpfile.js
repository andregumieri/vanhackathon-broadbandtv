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
var del = require('del');
var path = require('path');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');



/**
 * TASKS
 */
/**
 * TASK: default
 * The default gulp runner
 */
gulp.task('default', ['sass', 'manifest', 'scripts', 'images', 'views', 'vendor'], function() {});

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
 * TASK: views
 * Copy the manifest file to the dist folder
 */
gulp.task('views', function() {
	return gulp.src(src+'/static/views/**/*')
		.pipe(gulp.dest(dst+'/static/views'));
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

/**
 * TASK: vendor
 * Runs the vendor.json file and bundle all the dependencies
 */
gulp.task('vendor', function() {
	var vendorSrc = src + '/static/vendor';
	var vendorDst = dst + '/static/vendor';
	var vendorJson = JSON.parse(fs.readFileSync(vendorSrc + '/vendor.json'));
	del.sync(vendorDst);

	for(var file in vendorJson) {

		// Normalizes the paths
		for(var x=0; x<vendorJson[file].length; x++) {
			vendorJson[file][x] = vendorSrc+'/'+vendorJson[file][x];
		}

		gulp.src(vendorJson[file])
			.pipe(concat(file))
			.pipe(gulp.dest(vendorDst))
	}
});
