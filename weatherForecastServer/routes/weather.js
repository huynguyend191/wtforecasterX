darksky = require("../common/darksky") 

var express = require('express')
var router = express.Router()
var axios = require('axios')

const MaxHourlyForecast = 24

router.post('/summary', (req, res, next) => {
    let cities = req.body.cities
    let unit = req.body.unit || 'si'
    let cities_weather  = []
    let count = 0;
    for(let index = 0;index < (cities.length);++index){
        let long = cities[index].longitude
        let lat = cities[index].latitude
        getForecast(long, lat, unit, ["minutely", "hourly", "daily", "alerts", "flags"])
        .then(result => {
            let data = {
                timezone: result.timezone,
                longitude: result.longitude,
                latitude: result.latitude,
                city: cities[index].city,
                current: {
                    time: toLocalTime(result.currently.time),
                    icon: result.currently.icon,
                    temp: result.currently.temperature,
                    uvIndex: result.currently.uvIndex,
                    humidity: result.currently.humidity
                }
            }
            count += 1
            cities_weather.push(data)
            if(count == cities.length){
                res.send(cities_weather)
            }
        })
        
    }
    
    
})

router.get('/Current', (req, res, next) => {
    let latitude = req.query["latitude"]
    let longitude = req.query["longitude"]
    let unit = req.query['unit'] || 'si'
    console.log(longitude)
    console.log(latitude)
    getForecast(longitude, latitude, unit, ["minutely", "hourly", "daily", "alerts", "flags"])
    .then(result => {
        console.log(result.timezone)
        res.send({
            weatherInfor: {
                timezone: result.timezone,
                longitude: result.longitude,
                latitude: result.latitude,
                current: convertWeatherData(result.currently).current
            } 
        })
    })
    .catch(err => {
        throw err
    })
})

router.get('/Hourly', (req, res) => {
    let latitude = req.query["latitude"]
    let longitude = req.query["longitude"]
    let unit = req.query['unit'] || 'si'
    console.log(longitude)
    console.log(latitude)
    console.log(unit)
    getForecast(longitude, latitude, unit, ["minutely", "currently", "daily", "alerts", "flags"])
    .then(result => {
        let counter = 0
        hourlyForecast = []
        result.hourly.data.forEach(h=>{
            if(counter < MaxHourlyForecast){
                data = convertWeatherData(h).current
                counter++;
                hourlyForecast.push(data)
            }
        })
        res.send({
            weatherInfor: {
                timezone: result.timezone,
                longitude: result.longitude,
                latitude: result.latitude,
                hourlySummary: result.hourly.summary,
                hourlyIcon: result.hourly.icon,
                hourlyForecast: hourlyForecast
            }
        })
    })
})

router.get('/Daily', (req, res)=>{
    let latitude = req.query["latitude"]
    let longitude = req.query["longitude"]
    let unit = req.query['unit'] || 'si'
    console.log(unit)
    console.log(longitude)
    console.log(latitude)
    getForecast(longitude, latitude, unit, ["minutely", "currently", "hourly", "alerts", "flags"])
    .then(result => {
        dailyForecast = []
        result.daily.data.forEach(dd => {
            dailyForecast.push({
                date: new Date(dd.sunriseTime*1000).toDateString(),
                summary: dd.summary,
                icon: dd.icon,
                sunriseTime: toLocalTime(dd.sunriseTime),
                sunsetTime: toLocalTime(dd.sunsetTime),
                precipProbability: dd.precipProbability,
                precipType: dd.precipType,
                temperatureDaynight: dd.temperatureHigh,
                temperatureDaynightTime: toLocalTime(dd.temperatureHighTime),
                temperatureOvernight: dd.temperatureLow,
                temperatureOvernightTime: toLocalTime(dd.temperatureLowTime),
                apparenttemperatureDaynight: dd.apparentTemperatureHigh,
                apparenttemperatureDaynightTime: toLocalTime(dd.apparentTemperatureHighTime),
                apparenttemperatureOvernight: dd.apparentTemperatureLow,
                apparenttemperatureOvernightTime: toLocalTime(dd.apparentTemperatureLowTime),
                humidity: dd.humidity,
                pressure: dd.pressure,
                windSpeed: dd.windSpeed,
                uvIndex: dd.uvIndex,
                ozone: dd.ozone,
                temperatureMin: dd.temperatureMin,
                temperatureMinTime: toLocalTime(dd.temperatureMinTime),
                temperatureMax: dd.temperatureMax,
                temperatureMaxTime: toLocalTime(dd.temperatureMaxTime),
                apparentTemperatureMin: dd.apparentTemperatureMin,
                apparentTemperatureMinTime: toLocalTime(dd.apparentTemperatureMinTime),
                apparentTemperatureMax: dd.apparentTemperatureMax,
                apparentTemperatureMaxTime: toLocalTime(dd.apparentTemperatureMaxTime)

            })  
        })
        res.send({
            weatherInfor: {
                timezone: result.timezone,
                longitude: result.longitude,
                latitude: result.latitude,
                dailySummary: result.daily.summary,
                dailyIcon: result.daily.icon,
                dailyForecast: dailyForecast
            }
        })
    })
})

router.get('/Date', (req, res) => {
    let longitude = req.query['longitude']
    let latitude = req.query['latitude']
    let date = req.query['date']
    let month = req.query['month']
    let year = req.query['year']
    let time_string = year + '-' + month +'-'+date
    let unit = req.query['unit'] || 'si'
    console.log(time_string)
    console.log(longtitude)
    console.log(latitude)
    let time_miliseconds = new Date(time_string).getTime()
    console.log(time_miliseconds)
    const request_url = 'https://api.darksky.net/forecast/bf1a10e1f3efc8ab396812da1081cae0/' 
                    + latitude + ',' + longitude + ',' + time_miliseconds/1000 + '?exclude=flags,alerts&unit=si'
    axios.get(request_url)
    .then(result => {
        res.send(result.data)
    })
    .catch(err => {
        console.log(err)
    })
})

const getForecast =  (long, lat, unit, excludeBlocks) => {
    // let date = new Date()
    // let current = date.getFullYear + "-" + (date.getMonth()+1) + "-" + date.getDate()
    return darksky
    .latitude(lat)            
    .longitude(long)           
    .units(unit)                    
    .language('en') 
    .exclude(excludeBlocks)
    .get()
    
};


const convertWeatherData = (data) => {
    return {
        current: {
            time: toLocalTime(data.time),
            icon: data.icon,
            summary: data.summary,
            precipProbability: data.precipProbability,
            temp: data.temperature,
            apparentTemp: data.apparentTemperature,
            humidity: data.humidity,
            uvIndex: data.uvIndex,
            pressure: data.pressure,
            windSpeed: data.windSpeed,
            
        }
    } 
}

const toLocalTime = (data) => {
    let date = new Date(data*1000).toString()
    // return new Date(date.replace("Z","")+"UTC").toString()
    return date
}


module.exports = router