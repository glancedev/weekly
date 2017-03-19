var gulp = require('gulp')
var uglify = require('gulp-uglify')
var cssmin = require('gulp-minify-css')
var mainBowerFiles = require('gulp-main-bower-files')
var stylus = require('gulp-stylus')
// var livereload = require('gulp-livereload')
var include = require('gulp-include')
var concat = require('gulp-concat')
var browserify = require('gulp-browserify')
var gulpFilter = require('gulp-filter')
// var watch = require('gulp-watch')
var rename = require('gulp-rename')

var src = {  
  css: ['.components/**/*.css'],
  html: ['.components/**/*.html'],
  // js: ['assets/**/*.js'],
  bower: ['.bower.json']
}
src.styles = src.css.concat(src.css)
// src.scripts = src.coffee.concat(src.js)

var publishdir = 'dist'
var dist = {
  all: [publishdir + '/**/*'],
  css: publishdir + '/static/',
  js: publishdir + '/static/',
  vendor: publishdir + '/static/'
}

//
// concat *.js to `vendor.js`
// and *.css to `vendor.css`
// rename fonts to `fonts/*.*`
//
gulp.task('bower', function() {
  	return gulp.src('bower.json')
        .pipe(mainBowerFiles( ))
        .pipe(uglify())
        .pipe(gulp.dest('../../dist/vendor'));
})



function buildCSS() {
  return gulp.src(src.styles)
    .pipe(stylus({use: ['nib']}))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(dist.css))
}

function buildJS() {
  return gulp.src(src.scripts)
    .pipe(include())
    .pipe(coffee())
    .pipe(browserify({
      insertGlobals: true,
      extensions: ['.coffee'],
      debug: true
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(dist.js))
}

gulp.task('css', buildCSS)
gulp.task('js', buildJS)

// gulp.task('watch', function() {
//   gulp.watch(src.bower, ['bower'])
//   watch({ glob: src.styles, name: 'app.css' }, buildCSS)
//   watch({ glob: src.scripts, name: 'app.js' }, buildJS)
// })
//
// live reload can emit changes only when at lease one build is done
//
// gulp.task('livereload', ['bower', 'css', 'js', 'watch'], function() {
//   var server = livereload()
//   var batch = new BatchStream({ timeout: 100 })
//   gulp.watch(dist.all).on('change', function change(file) {
//     // clear directories
//     var urlpath = file.path.replace(__dirname + '/' + publishdir, '')
//     // also clear the tailing index.html
//     urlpath = urlpath.replace('/index.html', '/')
//     batch.write(urlpath)
//   })
//   batch.on('data', function(files) {
//     server.changed(files.join(','))
//   })
// })
gulp.task('compress-css', ['css'], function() {
  return gulp.src(dist.css)
    .pipe(cssmin())
    .pipe(gulp.dest(dist.css))
})
gulp.task('compress-js', ['js'], function() {
  return gulp.src(dist.js)
    .pipe(uglify())
    .pipe(gulp.dest(dist.js))
})
gulp.task('compress', ['compress-css', 'compress-js'])

gulp.task('default', ['bower', 'css', 'js', 'livereload']) // development
// gulp.task('build', ['bower', 'compress']) // build for production
gulp.task('build', ['bower']) // build for production