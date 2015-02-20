'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var gracefulExit = require('express-graceful-exit');
var passport = require('passport');
var session = require('express-session');
var stylus = require('stylus');
var mongoose = require('mongoose');
var expressJwt = require('express-jwt');

var app = express();

var router = require('./app/routes/router');
var errors = require('./config/errors');
var sty = require('./config/stylus');

// Set params for app
var log = logger('dev');

// connect to database
mongoose.connect(process.env.MONGOLAB_URI);

// view engine setup
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'jade');

app.use('/api/p', expressJwt({ secret: process.env.JWT_SECRET }));

app.use(gracefulExit.middleware(app));

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(log);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(stylus.middleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    compile: sty.compileStylus
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'some other secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

// catch 404 and forward to error handler
app.use(errors.notFound);

// catch 500 and forward to error handler
app.use(errors.internalError(app.get('env')));

app.set('port', process.env.PORT);

module.exports = app;
