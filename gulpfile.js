var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    // jshint = require('gulp-jshint'),
    // uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    // livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('styles', function() {
  return sass('styles/app.sass', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// gulp.task('scripts', function() {
//   return gulp.src('js/main.js')
//     // .pipe(jshint('.jshintrc'))
//     // .pipe(jshint.reporter('default'))
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('public/assets/js'))
//     .pipe(rename({suffix: '.min'}))
//     .pipe(uglify())
//     .pipe(gulp.dest('public/assets/js'))
//     .pipe(notify({ message: 'Scripts task complete' }));
// });

gulp.task('images', function() {
  return gulp.src('img/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('public/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function(cb) {
    del(['public/assets/css', 'public/assets/img'], cb)
});


// gulp.task('clean', function(cb) {
//     del(['public/assets/css', 'public/assets/js', 'public/assets/img'], cb)
// });

// gulp.task('default', ['clean'], function() {
//     gulp.start('styles', 'scripts', 'images');
// });

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'images');
});


gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('styles/**/*.scss', ['styles']);

  // Watch .js files
  // gulp.watch('js/main.js', ['scripts']);

  // Watch image files
  gulp.watch('img/*', ['images']);

  // Create LiveReload server
  // livereload.listen();

  // Watch any files in dist/, reload on change
  // gulp.watch(['public/**']).on('change', livereload.changed);

});