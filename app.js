var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');

var validator = require('express-validator');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');

var logger = require('morgan');

var socketIO =require('socket.io');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();
//https://stackoverflow.com/questions/24609991/using-socket-io-in-express-4-and-express-generators-bin-www
app.io = socketIO();

require('./sockets/chat')(app.io);
require('./sockets/notification')(app.io);

//run passport configuration
require('./passport/passport-local');
require('./passport/passport-google');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/*enable the cors*/
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(validator());
//sesstion can reuse in database, store session used in passport
app.use(session({
    resave: true,
    saveUninitialized: false ,
    secret: 'peace',
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(flash());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://peace:123@localhost/myDB');
//mongoose.connect('mongodb://Peace2018:heping1991@ds153198.mlab.com:53198/auth');
//passport config as
//http://www.passportjs.org/docs/configure/
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', userRouter);

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
