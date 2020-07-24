const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const path = require('path');
const pipeline = require('readable-stream').pipeline;

function styles() {
	return gulp.src('src/styles/**/*.less')
		.pipe(less({
      		paths: [ path.join(__dirname, 'less', 'includes') ]
    	}))
    	.pipe(concat('all.css'))
    	.pipe(autoprefixer({
            browsers: ['>0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
        	level: 2
        }))

		.pipe(gulp.dest('build/styles/css'));
}

function scripts() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(concat('all.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('build/scripts/js'));
}

function watch(){
    gulp.watch('src/styles/**/*.less', styles);
    gulp.watch('src/scripts/**/*.js', scripts);
}

gulp.task('default', watch);