var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var weatherRouter = require('./routes/weather')
var newsRouter = require('./routes/getWeatherNews')
var weatherCacheRouter = require('./routes/weather.cache')
var placeRouter = require('./routes/places')
var app = express();

require('./common/cors.config')(app)


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/places', placeRouter)
app.use('/weather', weatherRouter);
app.use('/weathercache', weatherCacheRouter)
app.use('/news',newsRouter)
module.exports = app;
