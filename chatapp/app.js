var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var expressLayouts          = require('express-ejs-layouts');
const mongoose              = require('mongoose');
const validator             = require('express-validator');
const session 			        = require('express-session');
var pathConfig              = require('./path');

// Define Path
global.__base               = __dirname + '/';

// my_app
global.__path_myapp         = __base  + pathConfig.folder_myapp + '/';
global.__path_configs       = __path_myapp + pathConfig.folder_configs + '/';
global.__path_models       	= __path_myapp + pathConfig.folder_models + '/';
global.__path_validators   	= __path_myapp + pathConfig.folder_validators + '/';
global.__path_helpers   	= __path_myapp + pathConfig.folder_helpers + '/';
global.__path_schemas   	= __path_myapp + pathConfig.folder_schemas + '/';

// public
global.__path_public        = __base  + pathConfig.folder_public + '/';

// router
global.__path_routes        = __path_myapp + pathConfig.folder_routes + '/';

// views
global.__path_views         = __path_myapp + pathConfig.folder_views + '/';
global.__path_users         = __path_views + pathConfig.folder_users + '/';

// Models
global.__path_models_admin       	= __path_models + pathConfig.folder_models_admin + '/';
global.__path_models_users       	= __path_models + pathConfig.folder_models_users + '/';

var systemConfig            = require(__path_configs + 'system');
const databaseConfig        = require(__path_configs + 'database');

var app = express();
// Database
mongoose.connect(`mongodb://localhost/${databaseConfig.database}`, {
	keepAlive: true,
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});
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
app.use(session({
	secret: 'secret',
	cookie: {maxAge: 10*60*1000},
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
// Setup router
app.use(`/${systemConfig.prefixUsers}`, require(__path_routes + 'users/index'));

//Local Variable
app.locals.systemConfig     = systemConfig;

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
