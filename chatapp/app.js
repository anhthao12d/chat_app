var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var expressLayouts = require('express-ejs-layouts');

var pathConfig              = require('./path');

// Define Path
global.__base               = __dirname + '/';

// my_app
global.__path_myapp         = __base  + pathConfig.folder_myapp + '/';
global.__path_configs       = __path_myapp + pathConfig.folder_configs + '/';
global.folder_models       = __path_myapp + pathConfig.folder_models + '/';

// public
global.__path_public        = __base  + pathConfig.folder_public + '/';

// router
global.__path_routes        = __path_myapp + pathConfig.folder_routes + '/';

// views
global.__path_views         = __path_myapp + pathConfig.folder_views + '/';
global.__path_users         = __path_views + pathConfig.folder_users + '/';

var systemConfig            = require(__path_configs + 'system');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', __path_users + 'login')

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// Setup router
app.use(`/${systemConfig.prefixUsers}`, require(__path_routes + 'users/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render(__path_views + 'error');
});

module.exports = app;
