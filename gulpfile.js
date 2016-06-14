'use strict';
var gulp = require('gulp');

var gulpSequence = require('gulp-sequence');

var useref = require('gulp-useref');
var gulpif = require('gulp-if');

var sass = require('gulp-sass'); //sass编译
var minifyCss = require('gulp-minify-css'); //css压缩
var minifyHtml = require('gulp-minify-html');
var csscomb = require('gulp-csscomb'); //css排序
var rename = require("gulp-rename"); //重命名
var autoprefixer = require('gulp-autoprefixer'); //css兼容前缀补全
var clean = require('gulp-dest-clean'); //清空目录

var uglify = require('gulp-uglify'); //js压缩
var concat = require('gulp-concat'); //js合并

var imagemin = require('gulp-imagemin'); //图片压缩
var pngquant = require('imagemin-pngquant'); //png压缩

var browserSync = require('browser-sync').create(); //本地服务和浏览器自动刷新
var reload = browserSync.reload; //浏览器重载
var myip = require('my-ip'); //ip获取

var dev = './src';
var dist = 'dist';

/**
 * task
 */

gulp.task('useref', ['css'], function() {
	return gulp.src(dev + '/**/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulp.dest(dist));
});


// css清理-编译-排序-压缩-补全-重命名
gulp.task('css', function() {
	return gulp.src(dev + '/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(csscomb())
		.pipe(autoprefixer({
			browsers: [
				"ie >= 8",
				"ie_mob >= 10",
				"ff >= 26",
				"chrome >= 30",
				"safari >= 6",
				"opera >= 23",
				"ios >= 5",
				"android >= 2.3",
				"bb >= 10"
			],
			cascade: false
		}))
		.pipe(gulp.dest('./.tmp/styles/'))
});


// 目录文件拷贝[未做处理的文件直接拷贝]
gulp.task('copy', ['favicon', 'data'], function() {});


gulp.task('favicon', function() {
	return gulp.src(dev + '/favicon.ico')
		.pipe(gulp.dest(dist + '/'));
});

gulp.task('data', function() {
	return gulp.src(dev + '/data/*.json')
		.pipe(gulp.dest(dist + '/data/'));
});

// 目录文件清除
gulp.task('clean', function() {
	return gulp.src('./')
		.pipe(clean('./.tmp/'))
		.pipe(clean(dist + '/'))
});

// 图片压缩
gulp.task('images', function() {
	return gulp.src(dev + '/images/**/*')
		.pipe(clean(dist + '/images/'))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(dist + '/images'));
});


// 服务
gulp.task('serve', ['watch'], function() {
	browserSync.init({
		host: myip(), //获取本地IP
		port: 8081, //设置端口号
		server: {
			baseDir: dev + "/", //设置本地目录
			routes: {
				"/bower_components": "bower_components",
				"/.tmp": ".tmp",
				"/.tmp/images": dev + "/images/"
			}
		},
		ui: {
			// UI端口设置
			port: 8080,
			weinre: {
				port: 9090
			}
		},
		open: "external",
		//不显示在浏览器中的任何通知。
		notify: false
	});
});

// 监听任务
gulp.task('watch', ['css'], function() {
	gulp.watch(dev + "/styles/**/*.scss", ['css']);
	gulp.watch("./.tmp/styles/**/*.css").on('change', reload);
	gulp.watch(dev + "/scripts/**/*.js").on('change', reload);
	gulp.watch(dev + "/data/*.json").on('change', reload);
	gulp.watch(dev + "/**/*.html").on('change', reload);
});


gulp.task('default', gulpSequence(['clean'], ['useref', 'images', 'copy']));