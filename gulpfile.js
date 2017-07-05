var gulp = require('gulp');
var server = require( 'gulp-develop-server');
var swaggerGenerator = require('gulp-apidoc-swagger');
var runSequence = require('run-sequence');
var shell = require('gulp-shell');

gulp.task( 'start:dev', function() {
  server.listen( { path: 'src/index.js' } );
  var watcher = gulp.watch( ['src/**/*.js', '!src/server/swagger.json'],
                            ['watch']);

  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type );
  });
});

gulp.task('watch', function(callback) {
  runSequence('doc-gen',
              'server:restart',
              callback);
});

gulp.task( 'server:restart', function() {
  return server.restart();
});

gulp.task('eslint', function () {
  return gulp.src('').pipe(shell([
    'npm run eslint'
  ]));
});

gulp.task('doc-gen', function(){
  return swaggerGenerator.exec({
    src: "src/api/",
    dest: "src/server/"
  });
});

gulp.task('default', ['start:dev']);
