var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session"); //session
const cors =require("cors");
const logMiddleware = require('./middlewares/logsMiddleware'); //log
require("dotenv").config(); // configuration 

const {connectToMongoDb} = require("./config/db"); // importation 
const http =require('http'); //1 

var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/userRouter');
var activitiesRouter = require('./routes/activityRouter');
var favorisRouter = require('./routes/favorisRouter');
var avisRouter = require('./routes/avisRouter');

var citiesRouter = require('./routes/cityRouter');
var reservationsRouter = require('./routes/reservationRouter');
var notficationRouter = require('./routes/notifcationRouter');

var app = express();
app.use(
  cors({
    origin: true,
    methods: "GET,POST,PUT,DELETE",
    credentials: true // Important pour les sessions/cookies
  })
)
app.use(session({   //cobfig session
  secret: "net secret pfe",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: {secure: false},
    maxAge: 24*60*60,
  
  },  
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/activities', activitiesRouter);
app.use('/favoris',favorisRouter);
app.use('/avis',avisRouter);
app.use('/cities',citiesRouter);
app.use('/reservations',reservationsRouter);
app.use('/notf',notficationRouter);

app.use('/files', express.static(path.join(__dirname, 'public', 'files')));


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

const server = http.createServer(app); // 
 server.listen(process.env.port ,() => { // pour lancer serveur
  connectToMongoDb()
  console.log("app is running on port 3000") ;
 });