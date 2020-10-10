var credentials = require('./credentials.js');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var vhost = require('vhost');
var mongoose = require('mongoose');
var passport = require('./lib/passport.js');

var apiRouter = require('./routes/api');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
var hbs = require('express-hbs');
app.engine('hbs', hbs.express4({
  partialsDir: path.join(__dirname, '/views/partials'),
  defaultLayout: path.join(__dirname, 'views/layout')
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(credentials.cookieSecret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 15, // 设置 session 的有效时间，单位毫秒
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// database
switch (app.get('env')) {
  case 'development':
    mongoose.connect(credentials.mongo.development.connectionString, {keepAlive: true, useNewUrlParser: true});
    break;
  case 'production':
    mongoose.connect(credentials.mongo.development.connectionString, {keepAlive: true, useNewUrlParser: true});
    break;
  default:
    throw new Error('Unknown execution environment:' + app.get('env'));
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connected successfully.');
});

// public message
app.use(function (req, res, next) {
  if (req.user) {
    res.locals.username = req.user.username;
  }
  next();
});

// router
app.use(vhost('api.*', apiRouter));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
