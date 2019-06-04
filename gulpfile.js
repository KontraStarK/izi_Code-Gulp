'use strict';

//Сonnection of modules Gulp
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const sizeFile = require('gulp-filesize');

// if Development - true, if Production - false
let isDev = false;
let isProd = !isDev;


const path = {
   dest: './build'
}

//Paths
const cssFiles = [
   'src/scss/main.scss'

]
const jsFiles = [
   'src/libs/*.js',
   'src/js/main.js'

]

// HTML
gulp.task('html', () => {
   return gulp.src('./src/**/*.html')
      .pipe(sizeFile())
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.stream());

});

// Style
gulp.task('styles', () => {
   return gulp.src(cssFiles)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('all.css'))
      .pipe(sizeFile())
      .pipe(gulpIf(isProd, autoprefixer({
         browsers: ['> 0.1%'],
         cascade: false
      })))
      .pipe(gulpIf(isProd, cleanCSS({
         level: 2
      })))
      .pipe(gulpIf(isDev, sourcemaps.write('./'))) 
      .pipe(gulp.dest(path.dest + '/css'))
      .pipe(sizeFile())
      .pipe(browserSync.stream());

});

// JS
gulp.task('scripts', () => {
   return gulp.src(jsFiles)
      .pipe(concat('all.js'))
      .pipe(uglify({
         toplevel: true
      }))
      .pipe(sizeFile())
      .pipe(gulp.dest(path.dest + '/js'))
      .pipe(sizeFile())
      .pipe(browserSync.stream());
});
// IMG
gulp.task('images', () => {
   return gulp.src('./src/img/**/*')
      .pipe(sizeFile()) 
      .pipe(gulpIf(isProd, imagemin([
         pngquant({
            quality: [0.5, 0.5]
         }),
         mozjpeg({
            quality: 50
         })
      ])))
      .pipe(gulp.dest(path.dest + '/img'))
      .pipe(sizeFile())
      .pipe(browserSync.stream());
});

//Сleaning the folder Build
gulp.task('clean', function () {
   return gulp.src('build', {
         read: false
      })
      .pipe(clean());
});

//Track changes to files
gulp.task('watch', () => {
         browserSync.init({
            server: {
               baseDir: "./build/",
               index: "index.html"
            }
         });
         gulp.watch('./src/**/*.html', gulp.series('html'))
         gulp.watch('./src/scss/**/*.scss', gulp.series('styles'))
         gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
         gulp.watch('./src/img/**/*', gulp.series('images'))
         gulp.watch('./build/**/*.html').on('change', browserSync.reload);
         gulp.watch('./build/**/*.css').on('change', browserSync.reload);

               });


               gulp.task('build', gulp.series('clean', gulp.parallel('html', 'styles', 'scripts', 'images'))); gulp.task('default', gulp.series('build', 'watch'));

               //To start, type the command "gulp"