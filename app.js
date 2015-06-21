var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var users = require('./routes/users');
var session = require('express-session');
var app = express();
var config = require('./config.js');
var uuid = require('node-uuid');
var passport = require('passport'); // also in routes?

module.exports = app;

var fs = require('fs'); // Used for calendar API demo; probably not needed for full
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var calendar = google.calendar('v3');

var knexConfig = require('./db/knexfile.js');
var knex = require('knex')(knexConfig);
app.set('database', knex);
var database = app.get('database');

var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash()); // for passport flash messages
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  genid:function(req) {
    return uuid();
  },
  secret: config.sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
