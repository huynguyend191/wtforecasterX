const mongoose = require('mongoose')
const PlaceSchema = require('../entities/places.model')
const UserInforSchema = require('../entities/userInfor.model')
const HourlySchema = require('../entities/hourlyforecast.model')
const DailySchema = require('../entities/dailyforecast.model')
const NewsSchema = require('../entities/news.model')
mongoose.connect('mongodb://localhost:27017/weatherApp', function (err) {
  
    if (err) throw err;
  
    console.log('Successfully connected');
  
 });
mongoose.model('Places', PlaceSchema)
mongoose.model('UserInfor', UserInforSchema)
mongoose.model('Hourly', HourlySchema)
mongoose.model('Daily', DailySchema)
mongoose.model('News', NewsSchema)
module.exports = mongoose