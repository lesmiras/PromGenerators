'use strict';
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	replace = require('gulp-replace'),
	svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	nunjucksRender = require('gulp-nunjucks-render'),
	reload = browserSync.reload;

var path = {
	build: {
		core: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/images/',
		fonts: 'build/fonts/'
	},
	src: {
		core: 'src/',
		html: 'src/*.html',
		libs: 'src/libs/**/*.js',
		js_lib: 'src/js/libs.js',
		css_lib: 'src/css/libs.css',
		js: 'src/js/*.js',
		css: 'src/css/*.css',
		sass: 'src/sass/style.scss',
		img: 'src/images/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	watch: {
		html: 'src/*.html',
		js: 'src/js/*.js',
		sass: 'src/sass/*.scss',
	},
	clean: 'build'
};

// error handler
var onError = function (error) {
	notify({
		title: 'Task Failed [' + error.plugin + ']',
		message:  error.toString(),
	}).write(error);
	console.error(error.toString());
	this.emit('end');
};

gulp.task('browser-sync', function() {
	browserSync({
	    server: {
	        baseDir: "src"
	    },
	    notify: false
	});
});

gulp.task('clean', function() {
	return del.sync('build');
});

gulp.task('clean:sprites', function() {
	return del.sync([
		path.src.core + 'images/icons/sprite.svg', 
		path.src.core + 'images/icons/preview.html', 
		path.src.core+'sass/partials/_sprite.scss'
	]);
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('scripts:build', function() {
	return gulp.src(path.src.libs)
		.pipe(sourcemaps.init())
	    .pipe(concat('libs.js', { newLine: '\n;' }))
	    .pipe(uglify())
	    .pipe(sourcemaps.write())
		.pipe(gulp.dest(path.src.core+'js'));
});

gulp.task('style:build', function () {
    gulp.src(path.src.core+'css/libs.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('sprites', ['clean:sprites'], function () {
	return gulp.src(path.src.core + 'images/icons/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[class]').removeAttr('class');
				$('[style]').removeAttr('style');
				$('style').each(function () {
		          $(this).remove();
		        });
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			shape: {
		        dimension: {
		            maxWidth: 32,
		            maxHeight: 32
		        },
		        spacing: {
		            padding: 5
		        }
		    },
			mode: {
				symbol: {
					dest:'./icons',
					sprite: 'sprite.svg',
					prefix: '.%s',
            		dimensions: '-',   
					render: {
						scss: {
							dest:'../../sass/partials/_sprite.scss'
						}
					},
					example: true
				}
			}
		}))
		.pipe(gulp.dest('src/images'));
});

gulp.task('sass', function(){
	return gulp.src(['src/sass/style.scss', 'src/sass/libs.scss'])
		.pipe(sourcemaps.init())
		.pipe(plumber({errorHandler: onError}))
		.pipe(sass({
				includePaths: require('bourbon').includePaths
		}).on('error', sass.logError))
		.pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('src/css'))
		.pipe(reload({stream: true}))
});

gulp.task('nunjucks', function() {
	return gulp.src(path.src.core+'templates/*.njk')
		.pipe(nunjucksRender({
			path: ['src/templates']
		}))
		.pipe(gulp.dest('src'))
		.pipe(reload({stream: true}))
});

gulp.task('build', ['clean', 'image:build', 'style:build', 'scripts:build'], function() {

	var buildHtml = gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.core))

	var buildCss = gulp.src(path.src.core+'css/style.css')
		.pipe(gulp.dest(path.build.css))

	var buildFonts = gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))

	var buildJs = gulp.src(path.src.js)
		.pipe(gulp.dest(path.build.js))
});

gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/js/**/*.js', reload);
	gulp.watch('src/templates/**/*.njk', ['nunjucks']);
});

gulp.task('default', ['watch']);

