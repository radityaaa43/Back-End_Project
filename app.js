var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memberRouter = require("./routes/memberRouter");
var pustakawanRouter = require("./routes/pustakawanRouter");
var borrowRouter = require("./routes/borrowRouter");
var restoreRouter = require("./routes/restoreRouter");
var bookRouter = require("./routes/bookRouter");
var rackRouter = require("./routes/rackRouter");
var uploadRouter = require("./routes/uploadRouter");
var ratingRouter = require("./routes/ratingRouter");
var reviewRouter = require("./routes/reviewRouter");
var dotenv = require('dotenv');

dotenv.config();

var app = express();
var connect = mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }); 
connect.then((db) => {
  console.log('Berhasil connect Mongo DB');
}, (err) => {
  console.log('Error DB:' + err);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
require("./config/passport")(passport);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/member',memberRouter);
app.use('/pustakawan',pustakawanRouter);
app.use('/borrow',borrowRouter);
app.use('/restore',restoreRouter);
app.use('/rating',ratingRouter);
app.use('/review',reviewRouter);
app.use('/book',bookRouter);
app.use('/upload',uploadRouter);
app.use('/rack',rackRouter);

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
  res.render('error');
});

module.exports = app;