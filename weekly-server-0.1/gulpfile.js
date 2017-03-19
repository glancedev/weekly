/*
 * gulp setting
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var minify = require('gulp-minify');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');
var htmlreplace = require('gulp-html-replace');
var flatten = require('gulp-flatten');
var gulpFilter = require('gulp-filter');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var gulp_remove_logging = require("gulp-remove-logging");


// remove dist folder 
gulp.task('clean', function() {
  return gulp.src('./dist').pipe(clean({force: true}));
});

// move admin -asset
gulp.task('admin-assets', function() {  

  return gulp.src(['./client/admin/assets/**/*'])
    .pipe(gulp.dest('./dist/admin/assets'));
});

/* move web -asset */
gulp.task('web-assets', function() {

  return gulp.src(['./client/web/assets/**/*'])
  .pipe(gulp.dest('./dist/web/assets'));
});

// move admin - html
gulp.task('admin-app', function() { 

  return gulp.src(['./client/admin/app/**/*.html'])
    .pipe(gulp.dest('./dist/admin/app'));
});

// move admin - html
gulp.task('web-app', function() {

  return gulp.src(['./client/web/app/**/*.html'])
  .pipe(gulp.dest('./dist/web/app'));
});


// move admin -component
gulp.task('admin-components', function() {  

  return gulp.src(['./client/admin/components/**/*.html', './client/admin/components/**/**/*.css'])
    .pipe(gulp.dest('./dist/admin/components'));
});

// move web -component
gulp.task('web-components', function() {

  return gulp.src(['./client/web/components/**/*.html', './client/web/components/**/*.css'])
  .pipe(gulp.dest('./dist/web/components'));
});

// minify js  
gulp.task('admin-jshint', function () {
       
  return gulp.src(['./client/admin/app/app.js', './client/admin/app/**/**/*.js', './client/admin/components/**/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(minify({
          ext:{
              src:'-debug.js',
              min:'.js'
          }
      }))
    //only uglify if gulp is ran with '--type production'
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())   
    .pipe(gulp.dest('./dist/admin/scripts'));
});

// web minify js
gulp.task('web-jshint', function () {

  return gulp.src(['./client/web/app/app.js', './client/web/app/app.constant.js', './client/web/app/**/*.js', './client/web/app/**/**/*.js', './client/web/components/**/*.js'])
  .pipe(sourcemaps.init())
  .pipe(concat('bundle.js'))
  .pipe(ngAnnotate())
  .pipe(
    gulp_remove_logging({
    // Options (optional)
    // eg:
    namespace: ['console']
    })
  )
  .pipe(minify({
    ext:{
    src:'-debug.js',
    min:'.js'
    }
  }))
  //only uglify if gulp is ran with '--type production'
  // .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./dist/web/scripts'));
});

// minify html
gulp.task('admin-htmlreplace', function() {
  return gulp.src('./client/admin/index.html')
    .pipe(htmlreplace({
      // 'css': 'styles/style.css',
      'js': 'scripts/bundle.js'
    }))
    .pipe(gulp.dest('./dist/admin'));
});

// minify html
gulp.task('web-htmlreplace', function() {
  return gulp.src('./client/web/index.html')
  .pipe(htmlreplace({
    'css': 'css/app.css',
    'js': 'scripts/bundle.js'
  }))
  .pipe(gulp.dest('./dist/web'));
});

// gulp build
gulp.task('builddist', [
    'admin-assets', 'admin-app', 'admin-components', 'admin-jshint', 'admin-htmlreplace'
  ],
  function() {
    gulp.src('./dist/admin/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/admin'));


    // remove log
      gulp.src("./dist/admin/scripts/bundle-debug.js")
      .pipe(
        gulp_remove_logging({
          // Options (optional)
          // eg:
          namespace: ['console']
        })
      )
      .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(minify({
          ext:{
              src:'-debug.js',
              min:'.js'
          }
      }))
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/admin/scripts'));
});



// web style
gulp.task('web-styles', function () {
  return gulp.src(['./client/web/app/app.css', './client/web/app/**/*.css', './client/web/app/**/**/*.css', './components/**/*.css'])
  .pipe(sourcemaps.init())
  .pipe(concat('app.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./dist/web/css'));
});

// web gulp build
gulp.task('web-builddist', [
  'web-assets', 'web-app', 'web-components', 'web-styles', 'web-jshint', 'web-htmlreplace'
  ],
  function() {
  gulp.src('./dist/web/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/web'));


  // remove log
  // gulp.src("./dist/web/scripts/bundle-debug.js")
  //   .pipe(
  //  gulp_remove_logging({
  //    // Options (optional)
  //    // eg:
  //    namespace: ['console']
  //  })
  //   )
  //   .pipe(sourcemaps.init())
  //   .pipe(concat('bundle.js'))
  //   .pipe(minify({
  //  ext:{
  //    src:'-debug.js',
  //    min:'.js'
  //  }
  //   }))
  //   // .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
  //   .pipe(sourcemaps.write())
  //   .pipe(gulp.dest('./dist/web/scripts'));
  });


// gulp start
gulp.task('build', ['clean'], function() {
  gulp.start('builddist');
  gulp.start('web-builddist');
});
